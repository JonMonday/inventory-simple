"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const reservation_service_1 = require("../inventory/reservation.service");
const inventory_service_1 = require("../inventory/inventory.service");
const request_dto_1 = require("./dto/request.dto");
let RequestsService = class RequestsService {
    prisma;
    reservationService;
    inventoryService;
    constructor(prisma, reservationService, inventoryService) {
        this.prisma = prisma;
        this.reservationService = reservationService;
        this.inventoryService = inventoryService;
    }
    async create(userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const year = new Date().getFullYear();
            const sequence = await tx.systemSequence.upsert({
                where: { name_year: { name: 'REQUEST', year } },
                update: { nextValue: { increment: 1 } },
                create: { name: 'REQUEST', year, nextValue: 1001 },
            });
            const paddedValue = sequence.nextValue.toString().padStart(4, '0');
            const readableId = `REQ-${year}-${paddedValue}`;
            const request = await tx.request.create({
                data: {
                    readableId,
                    requesterUserId: userId,
                    status: request_dto_1.RequestStatus.DRAFT,
                    lines: {
                        create: dto.lines.map((line) => ({
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
    async submit(id, userId) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.request.findUnique({
                where: { id },
                include: { requester: true, lines: true },
            });
            if (!request)
                throw new common_1.NotFoundException('Request not found');
            if (request.status !== request_dto_1.RequestStatus.DRAFT) {
                throw new common_1.BadRequestException('Only DRAFT requests can be submitted');
            }
            if (request.requesterUserId !== userId) {
                throw new common_1.ForbiddenException('Only the requester can submit the request');
            }
            const requester = request.requester;
            if (!requester.departmentId || !requester.locationId) {
                throw new common_1.BadRequestException('User must have a department and location assigned before submitting a request');
            }
            const updatedRequest = await tx.request.update({
                where: { id },
                data: {
                    status: request_dto_1.RequestStatus.SUBMITTED,
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
    async findOne(id) {
        const request = await this.prisma.request.findUnique({
            where: { id },
            include: {
                requester: { select: { fullName: true, email: true } },
                lines: { include: { item: true } },
                events: { include: { user: { select: { fullName: true } } }, orderBy: { createdAt: 'desc' } },
                assignments: { include: { user: { select: { fullName: true } } } },
            },
        });
        if (!request)
            throw new common_1.NotFoundException('Request not found');
        return request;
    }
    async findAll(userId, role) {
        if (role === 'ADMIN') {
            return this.prisma.request.findMany({ include: { requester: true } });
        }
        return this.prisma.request.findMany({
            where: { requesterUserId: userId },
            include: { requester: true },
        });
    }
    async startReview(id, userId) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.request.findUnique({ where: { id } });
            if (!request)
                throw new common_1.NotFoundException('Request not found');
            if (request.status !== request_dto_1.RequestStatus.SUBMITTED) {
                throw new common_1.BadRequestException('Can only start review for SUBMITTED requests');
            }
            const updated = await tx.request.update({
                where: { id },
                data: {
                    status: request_dto_1.RequestStatus.IN_REVIEW,
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
    async refactor(id, userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.request.findUnique({
                where: { id },
                include: { lines: true },
            });
            if (!request)
                throw new common_1.NotFoundException('Request not found');
            if (request.status !== request_dto_1.RequestStatus.IN_REVIEW) {
                throw new common_1.BadRequestException('Can only refactor during IN_REVIEW stage');
            }
            const oldLinesJson = JSON.stringify(request.lines);
            await tx.requestLine.deleteMany({ where: { requestId: id } });
            const newLines = await tx.request.update({
                where: { id },
                data: {
                    lines: {
                        create: dto.lines.map((l) => ({
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
    async sendToApproval(id, userId, issueFromLocationId) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.request.findUnique({ where: { id }, include: { lines: true } });
            if (!request)
                throw new common_1.NotFoundException('Request not found');
            let locationId = request.issueFromLocationId;
            if (issueFromLocationId) {
                locationId = issueFromLocationId;
                await tx.request.update({ where: { id }, data: { issueFromLocationId } });
            }
            if (!locationId) {
                throw new common_1.BadRequestException('Cannot send to approval: Issue From Location must be set (or provided)');
            }
            for (const line of request.lines) {
                await this.reservationService.reserve(tx, line.id, line.itemId, locationId, line.quantity);
            }
            await tx.request.update({
                where: { id },
                data: {
                    status: request_dto_1.RequestStatus.IN_APPROVAL,
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
    async reassign(id, actorId, isAdmin, dto) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.request.findUnique({
                where: { id },
                include: { assignments: { where: { isActive: true } }, lines: true }
            });
            if (!request)
                throw new common_1.NotFoundException('Request not found');
            if (request.requesterUserId !== actorId && !isAdmin) {
                throw new common_1.ForbiddenException('Only the requester or an administrator can reassign a request');
            }
            if (dto.newLocationId && dto.newLocationId !== request.issueFromLocationId) {
                for (const line of request.lines) {
                    await this.reservationService.release(tx, line.id);
                }
                await tx.request.update({
                    where: { id },
                    data: { issueFromLocationId: dto.newLocationId }
                });
                if (request.status === request_dto_1.RequestStatus.IN_APPROVAL || request.status === request_dto_1.RequestStatus.APPROVED) {
                    for (const line of request.lines) {
                        await this.reservationService.reserve(tx, line.id, line.itemId, dto.newLocationId, line.quantity);
                    }
                }
            }
            const activeAssignment = request.assignments[0];
            if (activeAssignment) {
                await tx.requestAssignment.update({
                    where: { id: activeAssignment.id },
                    data: { isActive: false, completedAt: new Date() }
                });
            }
            await tx.requestAssignment.create({
                data: {
                    requestId: id,
                    userId: dto.newUserId,
                    level: activeAssignment?.level || 'REVIEW',
                    isActive: true
                }
            });
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
    async revertToReview(id, userId) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.request.findUnique({ where: { id }, include: { lines: true } });
            if (!request)
                throw new common_1.NotFoundException('Request not found');
            for (const line of request.lines) {
                await this.reservationService.release(tx, line.id);
            }
            await tx.request.update({
                where: { id },
                data: {
                    status: request_dto_1.RequestStatus.IN_REVIEW,
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
    async cancel(id, userId) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.request.findUnique({ where: { id }, include: { lines: true } });
            if (!request)
                throw new common_1.NotFoundException('Request not found');
            for (const line of request.lines) {
                await this.reservationService.release(tx, line.id);
            }
            await tx.request.update({
                where: { id },
                data: {
                    status: request_dto_1.RequestStatus.CANCELLED,
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
    async approve(id, userId) {
        return this.prisma.$transaction(async (tx) => {
            await tx.request.update({
                where: { id },
                data: {
                    status: request_dto_1.RequestStatus.APPROVED,
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
    async reject(id, userId) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.request.findUnique({
                where: { id },
                include: { lines: true }
            });
            if (!request)
                throw new common_1.NotFoundException('Request not found');
            for (const line of request.lines) {
                await this.reservationService.release(tx, line.id);
            }
            await tx.request.update({
                where: { id },
                data: {
                    status: request_dto_1.RequestStatus.REJECTED,
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
    async fulfill(id, userId) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const request = await tx.request.findUnique({
                    where: { id },
                    include: { lines: true }
                });
                if (!request)
                    throw new common_1.NotFoundException('Request not found');
                if (request.status !== request_dto_1.RequestStatus.APPROVED) {
                    throw new common_1.BadRequestException('Only APPROVED requests can be fulfilled');
                }
                if (!request.issueFromLocationId) {
                    throw new common_1.BadRequestException('System Logic Error: Request is approved but has no issue location');
                }
                for (const line of request.lines) {
                    await this.reservationService.commit(tx, line.id);
                    const reasonCode = await tx.reasonCode.findFirst({
                        where: {
                            isActive: true,
                            allowedMovements: { some: { movementType: 'ISSUE' } }
                        }
                    });
                    if (!reasonCode)
                        throw new common_1.BadRequestException('No active ISSUE reason code found for fulfillment');
                    await this.inventoryService.recordMovement(tx, {
                        itemId: line.itemId,
                        locationId: request.issueFromLocationId,
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
                        status: request_dto_1.RequestStatus.FULFILLED,
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
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException)) {
                await this.prisma.request.update({
                    where: { id },
                    data: {
                        status: request_dto_1.RequestStatus.IN_REVIEW,
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
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        reservation_service_1.ReservationService,
        inventory_service_1.InventoryService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map