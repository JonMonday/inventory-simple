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
let RequestsService = class RequestsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const statusDraft = await tx.requestStatus.findUnique({ where: { code: 'DRAFT' } });
            if (!statusDraft) {
                console.error('CRITICAL: DRAFT status not found in system. Please run seed.');
                throw new common_1.NotFoundException('DRAFT status not found in system. Please run npm run db:seed in backend.');
            }
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user)
                throw new common_1.NotFoundException('User not found');
            if (!user.departmentId || !user.unitId) {
            }
            const year = new Date().getFullYear();
            const sequence = await tx.systemSequence.upsert({
                where: { name_year: { name: 'REQUEST', year } },
                update: { nextValue: { increment: 1 } },
                create: { name: 'REQUEST', year, nextValue: 1001 },
            });
            const readableId = `REQ-${year}-${sequence.nextValue.toString().padStart(4, '0')}`;
            const eventTypeCreated = await tx.requestEventType.findUnique({ where: { code: 'CREATED' } });
            if (!eventTypeCreated)
                throw new common_1.NotFoundException('CREATED event type not found');
            const request = await tx.request.create({
                data: {
                    readableId,
                    requesterUserId: userId,
                    statusId: statusDraft.id,
                    departmentId: user.departmentId,
                    unitId: user.unitId,
                    templateId: dto.templateId,
                    lines: {
                        create: dto.lines.map((line) => ({
                            itemId: line.itemId,
                            quantity: line.quantity,
                        })),
                    },
                    events: {
                        create: {
                            eventTypeId: eventTypeCreated.id,
                            actedByUserId: userId,
                            fromStatusId: null,
                            toStatusId: statusDraft.id,
                            metadata: `Request ${readableId} created.`,
                        },
                    },
                },
                include: { lines: true, status: true },
            });
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
    async findAll(userId, role) {
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
    async findOne(id) {
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
        if (!request)
            throw new common_1.NotFoundException('Request not found');
        return request;
    }
    async update(id, dto) {
        return this.prisma.request.update({
            where: { id },
            data: {
                issueFromStoreId: dto.issueFromStoreId,
            },
            include: { lines: true, status: true }
        });
    }
    async clone(id, userId) {
        const source = await this.findOne(id);
        const dto = {
            templateId: source.templateId || undefined,
            lines: source.lines.map(l => ({ itemId: l.itemId, quantity: l.quantity }))
        };
        return this.create(userId, dto);
    }
    async addLine(requestId, dto) {
        return this.prisma.requestLine.create({
            data: {
                requestId,
                itemId: dto.itemId,
                quantity: dto.quantity
            }
        });
    }
    async updateLine(lineId, quantity) {
        return this.prisma.requestLine.update({
            where: { id: lineId },
            data: { quantity }
        });
    }
    async removeLine(lineId) {
        return this.prisma.requestLine.delete({
            where: { id: lineId }
        });
    }
    async getLines(requestId) {
        return this.prisma.requestLine.findMany({
            where: { requestId },
            include: { item: true }
        });
    }
    async getEvents(id) {
        return this.prisma.requestEvent.findMany({
            where: { requestId: id },
            include: { actedBy: { select: { fullName: true } }, eventType: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getAssignments(requestId, all = false) {
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
    async resolveEligibleReviewers(requestId) {
        const request = await this.prisma.request.findUnique({
            where: { id: requestId },
            include: {
                template: { include: { workflowSteps: { include: { stageType: true } } } },
                currentStageType: true
            }
        });
        if (!request || !request.currentStageTypeId) {
            throw new common_1.BadRequestException('Request is not in an active stage');
        }
        const step = request.template?.workflowSteps.find(s => s.stageTypeId === request.currentStageTypeId);
        if (!step) {
            throw new common_1.BadRequestException('Current stage is not defined in the template workflow');
        }
        const userQuery = {
            isActive: true,
            roles: {
                some: {
                    role: { code: step.roleKey }
                }
            }
        };
        if (step.branchId)
            userQuery.branchId = step.branchId;
        if (step.includeRequesterDepartment) {
            userQuery.departmentId = request.departmentId;
        }
        else if (step.departmentId) {
            userQuery.departmentId = step.departmentId;
        }
        if (step.unitId)
            userQuery.unitId = step.unitId;
        if (step.jobRoleId)
            userQuery.jobRoleId = step.jobRoleId;
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
    async createAssignments(requestId, actorId, stageId, userIds) {
        const eligibleData = await this.resolveEligibleReviewers(requestId);
        if (eligibleData.stageId !== stageId) {
            throw new common_1.BadRequestException('Assignments can only be created for the current active stage');
        }
        if (eligibleData.assignmentMode !== 'MANUAL_FROM_POOL' && !eligibleData.constraints.allowRequesterSelect) {
        }
        const invalidIds = userIds.filter(id => !eligibleData.eligibleUsers.some(u => u.id === id));
        if (invalidIds.length > 0) {
            throw new common_1.BadRequestException(`Following users are ineligible for this stage: ${invalidIds.join(', ')}`);
        }
        if (userIds.length > eligibleData.maxApprovers) {
            throw new common_1.BadRequestException(`Maximum ${eligibleData.maxApprovers} approvers can be assigned`);
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.requestAssignment.updateMany({
                where: { requestId, stageTypeId: stageId, status: 'ACTIVE' },
                data: { status: 'CANCELLED', completedAt: new Date() }
            });
            const created = await Promise.all(userIds.map(uid => tx.requestAssignment.create({
                data: {
                    requestId,
                    assignedToId: uid,
                    assignedById: actorId,
                    stageTypeId: stageId,
                    assignmentType: 'USER',
                    status: 'ACTIVE'
                }
            })));
            return created;
        });
    }
    async getParticipants(id) {
        const participants = await this.prisma.requestParticipant.findMany({
            where: { requestId: id },
            include: { user: { select: { fullName: true, email: true } }, participantRoleType: true }
        });
        return participants.map(p => ({
            ...p,
            roleType: p.participantRoleType
        }));
    }
    async getReservations(id) {
        return this.prisma.reservation.findMany({
            where: { requestId: id },
            include: { requestLine: { include: { item: true } } }
        });
    }
    async getComments(id) {
        return this.prisma.requestComment.findMany({
            where: { requestId: id },
            include: { author: { select: { fullName: true } }, commentType: true },
            orderBy: { createdAt: 'asc' }
        });
    }
    async addComment(id, userId, body) {
        const commentType = await this.prisma.commentType.findUnique({ where: { code: 'GENERAL' } });
        return this.prisma.requestComment.create({
            data: {
                requestId: id,
                authorId: userId,
                commentTypeId: commentType.id,
                body
            }
        });
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map