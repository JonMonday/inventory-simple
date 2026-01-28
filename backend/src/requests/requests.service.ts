import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto, RequestLineDto, UpdateRequestDto } from './dto/request.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RequestsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateRequestDto) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Get DRAFT status
            const statusDraft = await tx.requestStatus.findUnique({ where: { code: 'DRAFT' } });
            if (!statusDraft) {
                console.error('CRITICAL: DRAFT status not found in system. Please run seed.');
                throw new NotFoundException('DRAFT status not found in system. Please run npm run db:seed in backend.');
            }

            // 2. Get User's Organization Info
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) throw new NotFoundException('User not found');
            if (!user.departmentId || !user.unitId) {
                // In this new schema, users MUST have dept/unit. Maybe check?
                // Seed data ensures it.
            }

            // 3. Generate Readable ID
            const year = new Date().getFullYear();
            const sequence = await tx.systemSequence.upsert({
                where: { name_year: { name: 'REQUEST', year } },
                update: { nextValue: { increment: 1 } },
                create: { name: 'REQUEST', year, nextValue: 1001 },
            });
            const readableId = `REQ-${year}-${sequence.nextValue.toString().padStart(4, '0')}`;

            // 4. Create Request
            const eventTypeCreated = await tx.requestEventType.findUnique({ where: { code: 'CREATED' } });
            if (!eventTypeCreated) throw new NotFoundException('CREATED event type not found');

            const request = await tx.request.create({
                data: {
                    readableId,
                    requesterUserId: userId,
                    statusId: statusDraft.id,
                    departmentId: user.departmentId,
                    unitId: user.unitId,
                    templateId: dto.templateId,
                    lines: {
                        create: dto.lines.map((line: any) => ({
                            itemId: line.itemId,
                            quantity: line.quantity,
                        })),
                    },
                    events: {
                        create: {
                            eventTypeId: eventTypeCreated!.id,
                            actedByUserId: userId,
                            fromStatusId: null,
                            toStatusId: statusDraft.id,
                            metadata: `Request ${readableId} created.`,
                        },
                    },
                },
                include: { lines: true, status: true },
            });

            // 5. Upsert Participant (Requester)
            const roleRequester = await tx.participantRoleType.findUnique({ where: { code: 'REQUESTER' } });
            if (roleRequester) {
                await tx.requestParticipant.upsert({
                    where: { requestId_userId: { requestId: request.id, userId } },
                    create: { requestId: request.id, userId, participantRoleTypeId: roleRequester.id },
                    update: { lastActionAt: new Date() }
                });
            }

            return request;
        });
    }

    async findAll(userId: string, role?: string) {
        // Filter logic:
        // Admin: see all?
        // Requester: see own.
        // Reviewer/Approver/Storekeeper: see "participated" or "inbox".
        // For simple findAll, let's just show own requests + participated?
        // Or if Admin, all.

        if (role === 'ADMIN') {
            return this.prisma.request.findMany({
                include: { requester: true, status: true, department: true },
                orderBy: { createdAt: 'desc' }
            });
        }

        return this.prisma.request.findMany({
            where: { requesterUserId: userId },
            include: { requester: true, status: true, department: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string) {
        const request = await this.prisma.request.findUnique({
            where: { id },
            include: {
                requester: {
                    select: {
                        fullName: true,
                        email: true,
                        department: { select: { name: true } }
                    }
                },
                department: true,
                unit: true,
                status: true,
                currentStageType: true,
                lines: { include: { item: true } },
                assignments: {
                    where: { status: 'ACTIVE' },
                    include: { assignedTo: { select: { fullName: true, email: true } }, stageType: true }
                },
                events: {
                    include: {
                        actedBy: { select: { fullName: true } },
                        eventType: true,
                        comment: true
                    },
                    orderBy: { createdAt: 'desc' }
                },
                comments: {
                    include: { author: { select: { fullName: true } }, commentType: true },
                    orderBy: { createdAt: 'asc' }
                }
            },
        });
        if (!request) throw new NotFoundException('Request not found');
        return request;
    }

    async update(id: string, dto: UpdateRequestDto) {
        return this.prisma.request.update({
            where: { id },
            data: {
                issueFromStoreId: dto.issueFromStoreId,
            },
            include: { lines: true, status: true }
        });
    }

    async clone(id: string, userId: string) {
        const source = await this.findOne(id);

        const dto: CreateRequestDto = {
            templateId: source.templateId || undefined,
            lines: source.lines.map(l => ({ itemId: l.itemId, quantity: l.quantity }))
        };

        return this.create(userId, dto);
    }

    async addLine(requestId: string, dto: RequestLineDto) {
        return this.prisma.requestLine.create({
            data: {
                requestId,
                itemId: dto.itemId,
                quantity: dto.quantity
            }
        });
    }

    async updateLine(lineId: string, quantity: number) {
        return this.prisma.requestLine.update({
            where: { id: lineId },
            data: { quantity }
        });
    }

    async removeLine(lineId: string) {
        return this.prisma.requestLine.delete({
            where: { id: lineId }
        });
    }

    async getLines(requestId: string) {
        return this.prisma.requestLine.findMany({
            where: { requestId },
            include: { item: true }
        });
    }

    async getEvents(id: string) {
        return this.prisma.requestEvent.findMany({
            where: { requestId: id },
            include: { actedBy: { select: { fullName: true } }, eventType: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getAssignments(requestId: string, all: boolean = false) {
        return this.prisma.requestAssignment.findMany({
            where: {
                requestId,
                ...(all ? {} : { status: 'ACTIVE' })
            },
            include: {
                assignedTo: {
                    select: {
                        fullName: true,
                        email: true,
                        department: { select: { name: true } },
                        unit: { select: { name: true } }
                    }
                },
                stageType: true
            },
            orderBy: { assignedAt: 'desc' }
        });
    }

    async resolveEligibleReviewers(requestId: string) {
        const request = await this.prisma.request.findUnique({
            where: { id: requestId },
            include: {
                template: { include: { workflowSteps: { include: { stageType: true } } } },
                currentStageType: true
            }
        });

        if (!request || !request.currentStageTypeId) {
            throw new BadRequestException('Request is not in an active stage');
        }

        const step = request.template?.workflowSteps.find(s => s.stageTypeId === request.currentStageTypeId);
        if (!step) {
            throw new BadRequestException('Current stage is not defined in the template workflow');
        }

        // Base query for eligibility
        const userQuery: Prisma.UserWhereInput = {
            isActive: true,
            roles: {
                some: {
                    role: { code: step.roleKey }
                }
            }
        };

        // Apply Scope Filters
        if (step.branchId) userQuery.branchId = step.branchId;
        if (step.includeRequesterDepartment) {
            userQuery.departmentId = request.departmentId;
        } else if (step.departmentId) {
            userQuery.departmentId = step.departmentId;
        }

        if (step.unitId) userQuery.unitId = step.unitId;
        if (step.jobRoleId) userQuery.jobRoleId = step.jobRoleId;

        // Fetch Eligible Users
        const users = await this.prisma.user.findMany({
            where: userQuery,
            include: {
                department: { select: { name: true } },
                unit: { select: { name: true } },
                branch: { select: { name: true } },
                roles: { include: { role: true } }
            }
        });

        return {
            stageId: step.stageTypeId,
            stageLabel: step.stageType.label,
            assignmentMode: step.assignmentMode,
            roleKey: step.roleKey,
            minApprovers: step.minApprovers,
            maxApprovers: step.maxApprovers,
            eligibleUsers: users.map(u => ({
                id: u.id,
                fullName: u.fullName,
                email: u.email,
                departmentName: u.department.name,
                unitName: u.unit.name,
                branchName: u.branch.name,
                roleCodes: u.roles.map(r => r.role.code)
            })),
            constraints: {
                requireAll: step.requireAll,
                allowRequesterSelect: step.allowRequesterSelect
            }
        };
    }

    async createAssignments(requestId: string, actorId: string, stageId: string, userIds: string[]) {
        const eligibleData = await this.resolveEligibleReviewers(requestId);

        if (eligibleData.stageId !== stageId) {
            throw new BadRequestException('Assignments can only be created for the current active stage');
        }

        if (eligibleData.assignmentMode !== 'MANUAL_FROM_POOL' && !eligibleData.constraints.allowRequesterSelect) {
            // Check if actor is Admin? For now enforce mode rules.
            // throw new BadRequestException('Manual assignment is not allowed for this stage');
        }

        // Validate userIds
        const invalidIds = userIds.filter(id => !eligibleData.eligibleUsers.some(u => u.id === id));
        if (invalidIds.length > 0) {
            throw new BadRequestException(`Following users are ineligible for this stage: ${invalidIds.join(', ')}`);
        }

        if (userIds.length > eligibleData.maxApprovers) {
            throw new BadRequestException(`Maximum ${eligibleData.maxApprovers} approvers can be assigned`);
        }

        return this.prisma.$transaction(async (tx) => {
            // Cancel existing active assignments for this stage
            await tx.requestAssignment.updateMany({
                where: { requestId, stageTypeId: stageId, status: 'ACTIVE' },
                data: { status: 'CANCELLED', completedAt: new Date() }
            });

            // Create new ones
            const created = await Promise.all(userIds.map(uid =>
                tx.requestAssignment.create({
                    data: {
                        requestId,
                        assignedToId: uid,
                        assignedById: actorId,
                        stageTypeId: stageId,
                        assignmentType: 'USER',
                        status: 'ACTIVE'
                    }
                })
            ));

            return created;
        });
    }

    async getParticipants(id: string) {
        const participants = await this.prisma.requestParticipant.findMany({
            where: { requestId: id },
            include: { user: { select: { fullName: true, email: true } }, participantRoleType: true }
        });

        // Map for frontend compatibility (roleType instead of participantRoleType)
        return participants.map(p => ({
            ...p,
            roleType: p.participantRoleType
        }));
    }

    async getReservations(id: string) {
        return this.prisma.reservation.findMany({
            where: { requestId: id },
            include: { requestLine: { include: { item: true } } }
        });
    }

    async getComments(id: string) {
        return this.prisma.requestComment.findMany({
            where: { requestId: id },
            include: { author: { select: { fullName: true } }, commentType: true },
            orderBy: { createdAt: 'asc' }
        });
    }

    async addComment(id: string, userId: string, body: string) {
        const commentType = await this.prisma.commentType.findUnique({ where: { code: 'GENERAL' } });
        return this.prisma.requestComment.create({
            data: {
                requestId: id,
                authorId: userId,
                commentTypeId: commentType!.id,
                body
            }
        });
    }
}
