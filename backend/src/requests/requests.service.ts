import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReservationService } from '../inventory/reservation.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateRequestDto, UpdateRequestLinesDto, ReassignRequestDto, RequestStatus } from './dto/request.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RequestsService {
    constructor(
        private prisma: PrismaService,
        private reservationService: ReservationService,
        private inventoryService: InventoryService,
    ) { }

    async create(userId: string, dto: CreateRequestDto) {
        return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // 1. Atomic ID Generation (Year-Aware)
            const year = new Date().getFullYear();
            const sequence = await tx.systemSequence.upsert({
                where: { name_year: { name: 'REQUEST', year } },
                update: { nextValue: { increment: 1 } },
                create: { name: 'REQUEST', year, nextValue: 1001 },
            });

            // Use the value *before* increment provided by the return of upsert? 
            // Prisma upsert returns the *updated* record if it matched, or created record.
            // If it updated, nextValue is already incremented.
            // Let's assume we want the returned value to be the ID we use.
            // Actually, best practice is to use the returned value as the ID.

            // Format ID: REQ-YYYY-#### (padded to 4 digits)
            const paddedValue = sequence.nextValue.toString().padStart(4, '0');
            const readableId = `REQ-${year}-${paddedValue}`;

            // 2. Create Request Header
            const request = await tx.request.create({
                data: {
                    readableId,
                    requesterUserId: userId,
                    status: RequestStatus.DRAFT,
                    lines: {
                        create: dto.lines.map((line: any) => ({
                            itemId: line.itemId,
                            quantity: line.quantity,
                        })),
                    },
                    events: {
                        create: {
                            userId,
                            type: 'CREATED',
                            description: `Request ${readableId} created as DRAFT.`,
                        },
                    },
                },
                include: {
                    lines: true,
                },
            });

            return request;
        });
    }

    async submit(id: string, userId: string) {
        return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const request = await tx.request.findUnique({
                where: { id },
                include: { requester: true, lines: true },
            });

            if (!request) throw new NotFoundException('Request not found');
            if (request.status !== RequestStatus.DRAFT) {
                throw new BadRequestException('Only DRAFT requests can be submitted');
            }
            if (request.requesterUserId !== userId) {
                throw new ForbiddenException('Only the requester can submit the request');
            }

            // Snapshot user locations
            const requester = request.requester;
            if (!requester.departmentId || !requester.locationId) {
                throw new BadRequestException('User must have a department and location assigned before submitting a request');
            }

            const updatedRequest = await tx.request.update({
                where: { id },
                data: {
                    status: RequestStatus.SUBMITTED,
                    departmentId: requester.departmentId,
                    locationId: requester.locationId,
                    events: {
                        create: {
                            userId,
                            type: 'SUBMITTED',
                            description: 'Request submitted for review.',
                        },
                    },
                },
            });

            return updatedRequest;
        });
    }

    async findOne(id: string) {
        const request = await this.prisma.request.findUnique({
            where: { id },
            include: {
                requester: { select: { fullName: true, email: true } },
                lines: { include: { item: true } },
                events: { include: { user: { select: { fullName: true } } }, orderBy: { createdAt: 'desc' } },
                assignments: { include: { user: { select: { fullName: true } } } },
            },
        });
        if (!request) throw new NotFoundException('Request not found');
        return request;
    }

    async findAll(userId?: string, role?: string) {
        // Basic filtering logic
        if (role === 'ADMIN') {
            return this.prisma.request.findMany({ include: { requester: true } });
        }
        return this.prisma.request.findMany({
            where: { requesterUserId: userId },
            include: { requester: true },
        });
    }

    async startReview(id: string, userId: string) {
        return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const request = await tx.request.findUnique({ where: { id } });
            if (!request) throw new NotFoundException('Request not found');
            if (request.status !== RequestStatus.SUBMITTED) {
                throw new BadRequestException('Can only start review for SUBMITTED requests');
            }

            const updated = await tx.request.update({
                where: { id },
                data: {
                    status: RequestStatus.IN_REVIEW,
                    assignments: {
                        create: {
                            userId,
                            level: 'REVIEW',
                            isActive: true,
                        },
                    },
                    events: {
                        create: {
                            userId,
                            type: 'STATUS_CHANGE',
                            description: 'Review started.',
                        },
                    },
                },
            });
            return updated;
        });
    }

    async refactor(id: string, userId: string, dto: UpdateRequestLinesDto) {
        return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const request = await tx.request.findUnique({
                where: { id },
                include: { lines: true },
            });

            if (!request) throw new NotFoundException('Request not found');
            if (request.status !== RequestStatus.IN_REVIEW) {
                throw new BadRequestException('Can only refactor during IN_REVIEW stage');
            }

            // Record before snapshot for history
            const oldLinesJson = JSON.stringify(request.lines);

            // Remove old lines and add new ones
            await tx.requestLine.deleteMany({ where: { requestId: id } });

            const newLines = await tx.request.update({
                where: { id },
                data: {
                    lines: {
                        create: dto.lines.map((l: any) => ({
                            itemId: l.itemId,
                            quantity: l.quantity,
                        }))
                    },
                    events: {
                        create: {
                            userId,
                            type: 'REFACTORED',
                            description: dto.reason || 'Lines updated by reviewer.',
                            dataJson: JSON.stringify({ old: request.lines, new: dto.lines }),
                        }
                    }
                },
                include: { lines: true }
            });

            return newLines;
        });
    }

    /**
     * Sends the request to the approval stage. 
     * Requires issueFromLocationId to be set (so we know where to reserve from).
     * Creates reservations for all lines.
     */
    async sendToApproval(id: string, userId: string, issueFromLocationId?: string) {
        return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const request = await tx.request.findUnique({ where: { id }, include: { lines: true } });
            if (!request) throw new NotFoundException('Request not found');

            // 1. Determine Source Location
            let locationId = request.issueFromLocationId;
            if (issueFromLocationId) {
                locationId = issueFromLocationId;
                await tx.request.update({ where: { id }, data: { issueFromLocationId } });
            }

            if (!locationId) {
                throw new BadRequestException('Cannot send to approval: Issue From Location must be set (or provided)');
            }

            // 2. Create Reservations
            for (const line of request.lines) {
                await this.reservationService.reserve(tx, line.id, line.itemId, locationId, line.quantity);
            }

            // 3. Update Status
            await tx.request.update({
                where: { id },
                data: {
                    status: RequestStatus.IN_APPROVAL,
                    assignments: {
                        updateMany: { where: { requestId: id, isActive: true }, data: { isActive: false, completedAt: new Date() } }
                    },
                    events: {
                        create: {
                            userId,
                            type: 'STATUS_CHANGE',
                            description: 'Sent to approval. Stock reserved.',
                        },
                    },
                },
            });
        });
    }

    async reassign(id: string, actorId: string, isAdmin: boolean, dto: ReassignRequestDto) {
        return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const request = await tx.request.findUnique({
                where: { id },
                include: { assignments: { where: { isActive: true } }, lines: true }
            });
            if (!request) throw new NotFoundException('Request not found');

            // Rule: Only requester or ADMIN can reassign
            if (request.requesterUserId !== actorId && !isAdmin) {
                throw new ForbiddenException('Only the requester or an administrator can reassign a request');
            }

            // Handle Location Change if provided
            if (dto.newLocationId && dto.newLocationId !== request.issueFromLocationId) {
                // Release existing reservations if they exist
                for (const line of request.lines) {
                    await this.reservationService.release(tx, line.id);
                }

                // Update location
                await tx.request.update({
                    where: { id },
                    data: { issueFromLocationId: dto.newLocationId }
                });

                // Re-reserve at new location if it was in APPROVAL or APPROVED state
                if (request.status === RequestStatus.IN_APPROVAL || request.status === RequestStatus.APPROVED) {
                    for (const line of request.lines) {
                        await this.reservationService.reserve(tx, line.id, line.itemId, dto.newLocationId, line.quantity);
                    }
                }
            }

            const activeAssignment = request.assignments[0];
            if (activeAssignment) {
                // Deactivate current
                await tx.requestAssignment.update({
                    where: { id: activeAssignment.id },
                    data: { isActive: false, completedAt: new Date() }
                });
            }

            // Create new
            await tx.requestAssignment.create({
                data: {
                    requestId: id,
                    userId: dto.newUserId,
                    level: activeAssignment?.level || 'REVIEW',
                    isActive: true
                }
            });

            // Log event
            await tx.requestEvent.create({
                data: {
                    requestId: id,
                    userId: actorId,
                    type: 'REASSIGNMENT',
                    description: `Reassigned to ${dto.newUserId}. Reason: ${dto.reason || 'None'}`,
                }
            });

            return { message: 'Reassigned successfully' };
        });
    }

    async revertToReview(id: string, userId: string) {
        return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const request = await tx.request.findUnique({ where: { id }, include: { lines: true } });
            if (!request) throw new NotFoundException('Request not found');

            // Release Reservations
            for (const line of request.lines) {
                await this.reservationService.release(tx, line.id);
            }

            await tx.request.update({
                where: { id },
                data: {
                    status: RequestStatus.IN_REVIEW,
                    events: {
                        create: {
                            userId,
                            type: 'STATUS_CHANGE',
                            description: 'Reverted to review. Reservations released.',
                        }
                    }
                }
            });
        });
    }

    async cancel(id: string, userId: string) {
        return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const request = await tx.request.findUnique({ where: { id }, include: { lines: true } });
            if (!request) throw new NotFoundException('Request not found');

            // Release Reservations
            for (const line of request.lines) {
                await this.reservationService.release(tx, line.id);
            }

            await tx.request.update({
                where: { id },
                data: {
                    status: RequestStatus.CANCELLED,
                    events: {
                        create: {
                            userId,
                            type: 'STATUS_CHANGE',
                            description: 'Request cancelled. Reservations released.',
                        }
                    }
                }
            });
        });
    }

    async approve(id: string, userId: string) {
        return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            await tx.request.update({
                where: { id },
                data: {
                    status: RequestStatus.APPROVED,
                    assignments: {
                        updateMany: { where: { requestId: id, isActive: true }, data: { isActive: false, completedAt: new Date() } }
                    },
                    events: {
                        create: {
                            userId,
                            type: 'STATUS_CHANGE',
                            description: 'Request approved.',
                        }
                    }
                }
            });
        });
    }

    async reject(id: string, userId: string) {
        return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const request = await tx.request.findUnique({
                where: { id },
                include: { lines: true }
            });
            if (!request) throw new NotFoundException('Request not found');

            // 1. Release Reservations if they exist (usually after sendToApproval)
            for (const line of request.lines) {
                await this.reservationService.release(tx, line.id);
            }

            // 2. Update Status
            await tx.request.update({
                where: { id },
                data: {
                    status: RequestStatus.REJECTED,
                    assignments: {
                        updateMany: { where: { requestId: id, isActive: true }, data: { isActive: false, completedAt: new Date() } }
                    },
                    events: {
                        create: {
                            userId,
                            type: 'STATUS_CHANGE',
                            description: 'Request rejected. Reservations released.',
                        }
                    }
                }
            });
        });
    }

    async fulfill(id: string, userId: string) {
        try {
            return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
                const request = await tx.request.findUnique({
                    where: { id },
                    include: { lines: true }
                });

                if (!request) throw new NotFoundException('Request not found');
                if (request.status !== RequestStatus.APPROVED) {
                    throw new BadRequestException('Only APPROVED requests can be fulfilled');
                }
                if (!request.issueFromLocationId) {
                    throw new BadRequestException('System Logic Error: Request is approved but has no issue location');
                }

                for (const line of request.lines) {
                    // 1. Commit Reservation (Release reserved qty)
                    await this.reservationService.commit(tx, line.id);

                    // 2. Issue Stock (Ledger + OnHand)
                    const reasonCode = await tx.reasonCode.findFirst({
                        where: {
                            isActive: true,
                            allowedMovements: { some: { movementType: 'ISSUE' } }
                        }
                    });
                    if (!reasonCode) throw new BadRequestException('No active ISSUE reason code found for fulfillment');

                    await this.inventoryService.recordMovement(tx, {
                        itemId: line.itemId,
                        locationId: request.issueFromLocationId!,
                        relatedLocationId: request.departmentId ?? undefined,
                        movementType: 'ISSUE',
                        quantity: line.quantity,
                        reasonCodeId: reasonCode.id,
                        referenceNo: request.readableId,
                        userId,
                        comments: 'Request Fulfilled'
                    });
                }

                await tx.request.update({
                    where: { id },
                    data: {
                        status: RequestStatus.FULFILLED,
                        events: {
                            create: {
                                userId,
                                type: 'FULFILLED',
                                description: 'Request fulfilled and stock issued.',
                            }
                        }
                    }
                });

                return { success: true };
            });
        } catch (error) {
            // Handle Rollback Requirement: If any line fails, the transaction auto-rolls back.
            // But the user wants the request to revert to IN_REVIEW.
            // So we perform a separate transaction to update status and log error.
            if (!(error instanceof NotFoundException)) {
                await this.prisma.request.update({
                    where: { id },
                    data: {
                        status: RequestStatus.IN_REVIEW,
                        events: {
                            create: {
                                userId,
                                type: 'SYSTEM_ERROR',
                                description: `Fulfillment failed: ${error.message}. Request reverted to IN_REVIEW.`,
                            }
                        }
                    }
                });
            }
            throw error;
        }
    }
}
