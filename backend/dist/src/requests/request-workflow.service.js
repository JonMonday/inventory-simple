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
exports.RequestWorkflowService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RequestWorkflowService = class RequestWorkflowService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submit(requestId, userId) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.request.findUnique({
                where: { id: requestId },
                include: {
                    status: true,
                    requester: true,
                    template: { include: { workflowSteps: { orderBy: { stepOrder: 'asc' } } } }
                }
            });
            if (!request)
                throw new common_1.NotFoundException('Request not found');
            if (request.status.code !== 'DRAFT' && request.status.code !== 'REJECTED') {
                throw new common_1.BadRequestException('Only DRAFT or REJECTED requests can be submitted');
            }
            if (request.requesterUserId !== userId) {
                throw new common_1.ForbiddenException('Only the requester can submit the request');
            }
            const statusInFlow = await this.getStatus(tx, 'IN_FLOW');
            const firstStep = request.template?.workflowSteps[0];
            const stageTypeId = firstStep?.stageTypeId || (await this.getStageType(tx, 'UNIT_REVIEW')).id;
            const eventCode = request.status.code === 'REJECTED' ? 'RESUBMITTED' : 'SUBMITTED';
            const eventType = await this.getEventType(tx, eventCode);
            const updatedRequest = await tx.request.update({
                where: { id: requestId },
                data: {
                    statusId: statusInFlow.id,
                    currentStageTypeId: stageTypeId,
                    submittedAt: new Date(),
                }
            });
            await tx.requestAssignment.updateMany({
                where: { requestId, status: 'ACTIVE' },
                data: { status: 'COMPLETED', completedAt: new Date() }
            });
            await this.createStageAssignments(tx, requestId, stageTypeId, userId);
            await tx.requestEvent.create({
                data: {
                    requestId,
                    eventTypeId: eventType.id,
                    actedByUserId: userId,
                    fromStatusId: request.statusId,
                    toStatusId: statusInFlow.id,
                    toStageTypeId: stageTypeId,
                    metadata: `Request submitted for ${firstStep ? 'review' : 'unit review'}`
                }
            });
            await this.upsertParticipant(tx, requestId, userId, 'REQUESTER');
            return updatedRequest;
        });
    }
    async approve(requestId, userId, commentBody) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.request.findUnique({
                where: { id: requestId },
                include: {
                    status: true,
                    currentStageType: true,
                    template: { include: { workflowSteps: { include: { stageType: true } } } },
                    assignments: { where: { status: 'ACTIVE' } }
                }
            });
            if (!request || request.status.code !== 'IN_FLOW' || !request.currentStageType) {
                throw new common_1.BadRequestException('Request is not in flow');
            }
            const step = request.template?.workflowSteps.find(s => s.stageTypeId === request.currentStageTypeId);
            if (!step)
                throw new common_1.BadRequestException('Current stage is not defined in template');
            const userAssignment = request.assignments.find(a => a.assignedToId === userId);
            if (userAssignment) {
                await tx.requestAssignment.update({
                    where: { id: userAssignment.id },
                    data: { status: 'COMPLETED', completedAt: new Date() }
                });
            }
            else {
                await tx.requestAssignment.create({
                    data: {
                        requestId,
                        assignedToId: userId,
                        stageTypeId: request.currentStageTypeId,
                        assignmentType: 'USER',
                        status: 'COMPLETED',
                        completedAt: new Date(),
                        assignedAt: new Date()
                    }
                });
            }
            let commentId = undefined;
            if (commentBody) {
                const commentType = await this.getCommentType(tx, request.currentStageType.code.includes('REVIEW') ? 'REVIEW_NOTE' : 'APPROVAL_NOTE');
                const comment = await tx.requestComment.create({
                    data: {
                        requestId, authorId: userId, stageTypeId: request.currentStageTypeId,
                        commentTypeId: commentType.id, body: commentBody
                    }
                });
                commentId = comment.id;
            }
            await this.upsertParticipant(tx, requestId, userId, this.determineRoleFromStage(request.currentStageType.code));
            const completedCount = await tx.requestAssignment.count({
                where: { requestId, stageTypeId: request.currentStageTypeId, status: 'COMPLETED' }
            });
            let shouldAdvance = false;
            if (step.requireAll) {
                const activeOrDone = await tx.requestAssignment.count({
                    where: { requestId, stageTypeId: request.currentStageTypeId, assignmentType: 'USER', status: { in: ['ACTIVE', 'COMPLETED'] } }
                });
                shouldAdvance = completedCount >= activeOrDone && activeOrDone > 0;
            }
            else {
                shouldAdvance = completedCount >= step.minApprovers;
            }
            if (shouldAdvance) {
                const nextStep = request.template?.workflowSteps.find(s => s.stepOrder === step.stepOrder + 1);
                const nextStageId = nextStep?.stageTypeId || null;
                await tx.requestAssignment.updateMany({
                    where: { requestId, stageTypeId: request.currentStageTypeId, status: 'ACTIVE' },
                    data: { status: 'CANCELLED', completedAt: new Date() }
                });
                await tx.request.update({ where: { id: requestId }, data: { currentStageTypeId: nextStageId } });
                if (nextStageId)
                    await this.createStageAssignments(tx, requestId, nextStageId, userId);
                const eventCode = request.currentStageType.code.includes('REVIEW') ? 'REVIEWED' : 'APPROVED';
                const eventType = await this.getEventType(tx, eventCode);
                await tx.requestEvent.create({
                    data: {
                        requestId, eventTypeId: eventType.id, actedByUserId: userId,
                        fromStageTypeId: request.currentStageTypeId, toStageTypeId: nextStageId,
                        commentId, metadata: `Stage ${request.currentStageType.label} completed.`
                    }
                });
            }
            else {
                const eventType = await this.getEventType(tx, 'COMMENT_ADDED');
                await tx.requestEvent.create({
                    data: {
                        requestId, eventTypeId: eventType.id, actedByUserId: userId,
                        fromStageTypeId: request.currentStageTypeId, commentId,
                        metadata: `Approval registered (${completedCount}/${step.minApprovers})`
                    }
                });
            }
            return { success: true };
        });
    }
    async reject(requestId, userId, commentBody) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.request.findUnique({
                where: { id: requestId },
                include: { status: true, currentStageType: true, requester: true }
            });
            if (!request || request.status.code !== 'IN_FLOW')
                throw new common_1.BadRequestException('Not in flow');
            const statusRejected = await this.getStatus(tx, 'REJECTED');
            const eventType = await this.getEventType(tx, 'REJECTED');
            const comment = await tx.requestComment.create({
                data: {
                    requestId, authorId: userId, stageTypeId: request.currentStageTypeId,
                    commentTypeId: (await this.getCommentType(tx, 'REJECTION_COMMENT')).id, body: commentBody
                }
            });
            await tx.request.update({ where: { id: requestId }, data: { statusId: statusRejected.id, currentStageTypeId: null } });
            await tx.requestAssignment.updateMany({ where: { requestId, status: 'ACTIVE' }, data: { status: 'CANCELLED', completedAt: new Date() } });
            await tx.requestAssignment.create({
                data: { requestId, assignedToId: request.requesterUserId, assignedById: userId, assignmentType: 'USER', status: 'ACTIVE' }
            });
            await tx.requestEvent.create({
                data: {
                    requestId, eventTypeId: eventType.id, actedByUserId: userId, fromStatusId: request.statusId,
                    toStatusId: statusRejected.id, fromStageTypeId: request.currentStageTypeId, commentId: comment.id,
                    metadata: 'Request rejected'
                }
            });
            await this.upsertParticipant(tx, requestId, userId, this.determineRoleFromStage(request.currentStageType?.code));
            await this.upsertParticipant(tx, requestId, request.requesterUserId, 'REQUESTER');
        });
    }
    async cancel(requestId, userId, commentBody) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.request.findUnique({
                where: { id: requestId },
                include: { status: true, lines: { include: { reservation: true } } }
            });
            if (!request || ['CONFIRMED', 'CANCELLED'].includes(request.status.code))
                throw new common_1.BadRequestException('Terminal state');
            const statusCancelled = await this.getStatus(tx, 'CANCELLED');
            const eventType = await this.getEventType(tx, 'CANCELLED');
            for (const line of request.lines) {
                if (line.reservation) {
                    await tx.stockSnapshot.update({
                        where: { itemId_storeLocationId: { itemId: line.itemId, storeLocationId: line.reservation.storeLocationId } },
                        data: { reservedQuantity: { decrement: line.reservation.quantity } }
                    });
                    await tx.reservation.delete({ where: { id: line.reservation.id } });
                }
            }
            let commentId = undefined;
            if (commentBody) {
                const comment = await tx.requestComment.create({
                    data: { requestId, authorId: userId, commentTypeId: (await this.getCommentType(tx, 'CANCELLATION_COMMENT')).id, body: commentBody }
                });
                commentId = comment.id;
            }
            await tx.request.update({ where: { id: requestId }, data: { statusId: statusCancelled.id, currentStageTypeId: null } });
            await tx.requestAssignment.updateMany({ where: { requestId, status: 'ACTIVE' }, data: { status: 'CANCELLED', completedAt: new Date() } });
            await tx.requestEvent.create({
                data: { requestId, eventTypeId: eventType.id, actedByUserId: userId, toStatusId: statusCancelled.id, commentId, metadata: 'Cancelled' }
            });
            await this.upsertParticipant(tx, requestId, userId, 'REQUESTER');
        });
    }
    async reserve(requestId, userId) {
        try {
            await this.prisma.$transaction(async (tx) => {
                const request = await tx.request.findUnique({
                    where: { id: requestId },
                    include: { status: true, currentStageType: true, lines: true }
                });
                if (!request || request.currentStageType?.code !== 'FULFILLMENT')
                    throw new common_1.BadRequestException('Not in FULFILLMENT');
                if (!request.issueFromStoreId)
                    throw new common_1.BadRequestException('Stock location missing');
                for (const line of request.lines) {
                    await tx.stockSnapshot.upsert({
                        where: { itemId_storeLocationId: { itemId: line.itemId, storeLocationId: request.issueFromStoreId } },
                        create: { itemId: line.itemId, storeLocationId: request.issueFromStoreId, quantityOnHand: 0, reservedQuantity: line.quantity },
                        update: { reservedQuantity: { increment: line.quantity } }
                    });
                    await tx.reservation.create({
                        data: { requestLineId: line.id, itemId: line.itemId, storeLocationId: request.issueFromStoreId, quantity: line.quantity }
                    });
                }
                await tx.requestEvent.create({
                    data: { requestId, eventTypeId: (await this.getEventType(tx, 'RESERVED')).id, actedByUserId: userId, fromStageTypeId: request.currentStageTypeId, metadata: 'Stock reserved' }
                });
                await this.upsertParticipant(tx, requestId, userId, 'STOREKEEPER');
            });
        }
        catch (error) {
            await this.handleReservationFailure(requestId, userId, error instanceof Error ? error.message : 'Unknown');
            throw error;
        }
    }
    async handleReservationFailure(requestId, userId, errorMsg) {
        await this.prisma.$transaction(async (tx) => {
            const request = await tx.request.findUnique({ where: { id: requestId } });
            if (!request)
                return;
            const stageProc = await this.getStageType(tx, 'PROC_APPROVAL');
            await tx.request.update({ where: { id: requestId }, data: { currentStageTypeId: stageProc.id } });
            await tx.requestAssignment.updateMany({ where: { requestId, status: 'ACTIVE' }, data: { status: 'CANCELLED', completedAt: new Date() } });
            await this.createStageAssignments(tx, requestId, stageProc.id, userId);
            const comment = await tx.requestComment.create({
                data: { requestId, authorId: userId, commentTypeId: (await this.getCommentType(tx, 'SYSTEM_NOTE')).id, body: `Reservation fail: ${errorMsg}` }
            });
            await tx.requestEvent.create({
                data: { requestId, eventTypeId: (await this.getEventType(tx, 'RESERVATION_FAILED')).id, actedByUserId: userId, fromStageTypeId: request.currentStageTypeId, toStageTypeId: stageProc.id, commentId: comment.id }
            });
        });
    }
    async issue(requestId, userId) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.request.findUnique({
                where: { id: requestId },
                include: { currentStageType: true, lines: { include: { reservation: true } } }
            });
            if (!request || request.currentStageType?.code !== 'FULFILLMENT')
                throw new common_1.BadRequestException('Not in FULFILLMENT');
            const stageConf = await this.getStageType(tx, 'CONFIRMATION');
            const reasonCode = await tx.reasonCode.findFirst({ where: { code: 'ISSUE' } });
            for (const line of request.lines) {
                if (line.reservation) {
                    await tx.stockSnapshot.update({
                        where: { itemId_storeLocationId: { itemId: line.itemId, storeLocationId: line.reservation.storeLocationId } },
                        data: { quantityOnHand: { decrement: line.reservation.quantity }, reservedQuantity: { decrement: line.reservation.quantity } }
                    });
                    await tx.inventoryLedger.create({
                        data: {
                            itemId: line.itemId, fromStoreLocationId: line.reservation.storeLocationId,
                            movementTypeId: (await tx.ledgerMovementType.findUniqueOrThrow({ where: { code: 'ISSUE' } })).id,
                            quantity: line.reservation.quantity, unitOfMeasure: 'UNIT',
                            reasonCodeId: reasonCode.id, createdByUserId: userId, referenceNo: request.readableId
                        }
                    });
                    await tx.reservation.delete({ where: { id: line.reservation.id } });
                }
            }
            await tx.request.update({ where: { id: requestId }, data: { currentStageTypeId: stageConf.id } });
            await tx.requestAssignment.updateMany({ where: { requestId, status: 'ACTIVE' }, data: { status: 'CANCELLED', completedAt: new Date() } });
            await tx.requestAssignment.create({
                data: { requestId, assignedToId: request.requesterUserId, stageTypeId: stageConf.id, assignmentType: 'USER', status: 'ACTIVE' }
            });
            await tx.requestEvent.create({
                data: { requestId, eventTypeId: (await this.getEventType(tx, 'ISSUED')).id, actedByUserId: userId, fromStageTypeId: request.currentStageTypeId, toStageTypeId: stageConf.id, metadata: 'Stock issued' }
            });
            await this.upsertParticipant(tx, requestId, userId, 'STOREKEEPER');
        });
    }
    async confirm(requestId, userId, commentBody) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.request.findUnique({ where: { id: requestId }, include: { currentStageType: true } });
            if (!request || request.currentStageType?.code !== 'CONFIRMATION')
                throw new common_1.BadRequestException('Not in CONFIRMATION');
            await tx.request.update({ where: { id: requestId }, data: { statusId: (await this.getStatus(tx, 'CONFIRMED')).id, currentStageTypeId: null } });
            await tx.requestAssignment.updateMany({ where: { requestId, status: 'ACTIVE' }, data: { status: 'COMPLETED', completedAt: new Date() } });
            if (commentBody) {
                await tx.requestComment.create({
                    data: { requestId, authorId: userId, commentTypeId: (await this.getCommentType(tx, 'GENERAL')).id, body: commentBody }
                });
            }
            await tx.requestEvent.create({ data: { requestId, eventTypeId: (await this.getEventType(tx, 'CONFIRMED')).id, actedByUserId: userId, fromStageTypeId: request.currentStageTypeId, metadata: 'Confirmed' } });
            await this.upsertParticipant(tx, requestId, userId, 'REQUESTER');
        });
    }
    async reassign(requestId, actorId, targetUserId) {
        return this.prisma.$transaction(async (tx) => {
            const request = await tx.request.findUnique({ where: { id: requestId } });
            if (!request)
                throw new common_1.NotFoundException('Not found');
            await tx.requestAssignment.updateMany({ where: { requestId, status: 'ACTIVE' }, data: { status: 'CANCELLED', completedAt: new Date() } });
            await tx.requestAssignment.create({
                data: { requestId, assignedToId: targetUserId, stageTypeId: request.currentStageTypeId, assignedById: actorId, assignmentType: 'USER', status: 'ACTIVE' }
            });
            await tx.requestEvent.create({ data: { requestId, eventTypeId: (await this.getEventType(tx, 'REASSIGNED')).id, actedByUserId: actorId, metadata: `Reassigned` } });
        });
    }
    async createStageAssignments(tx, requestId, stageTypeId, actorId) {
        const request = await tx.request.findUniqueOrThrow({
            where: { id: requestId },
            include: { template: { include: { workflowSteps: { include: { stageType: true } } } } }
        });
        const step = request.template?.workflowSteps.find(s => s.stageTypeId === stageTypeId);
        if (!step)
            return;
        if (step.assignmentMode === 'AUTO_POOL' || step.assignmentMode === 'MANUAL_FROM_POOL') {
            await tx.requestAssignment.create({
                data: {
                    requestId, stageTypeId: step.stageTypeId, assignedById: actorId,
                    assignmentType: 'POOL', assignedRoleKey: step.roleKey, status: 'ACTIVE'
                }
            });
        }
        else if (step.assignmentMode === 'SPECIFIC_USERS') {
            const specific = await tx.templateStepSpecificUser.findMany({ where: { stepId: step.id } });
            await Promise.all(specific.map((su) => tx.requestAssignment.create({
                data: {
                    requestId, assignedToId: su.userId, stageTypeId: step.stageTypeId,
                    assignedById: actorId, assignmentType: 'USER', status: 'ACTIVE'
                }
            })));
        }
    }
    async upsertParticipant(tx, requestId, userId, roleCode) {
        const role = await this.getParticipantRoleType(tx, roleCode);
        await tx.requestParticipant.upsert({
            where: { requestId_userId: { requestId, userId } },
            create: { requestId, userId, participantRoleTypeId: role.id },
            update: { lastActionAt: new Date(), participantRoleTypeId: role.id }
        });
    }
    determineRoleFromStage(stageCode) {
        if (!stageCode)
            return 'REVIEWER';
        if (stageCode.includes('APPROVAL'))
            return 'APPROVER';
        if (stageCode.includes('REVIEW'))
            return 'REVIEWER';
        if (stageCode === 'FULFILLMENT')
            return 'STOREKEEPER';
        return 'REVIEWER';
    }
    async getStatus(tx, code) {
        return tx.requestStatus.findUniqueOrThrow({ where: { code } });
    }
    async getStageType(tx, code) {
        return tx.requestStageType.findUniqueOrThrow({ where: { code } });
    }
    async getEventType(tx, code) {
        return tx.requestEventType.findUniqueOrThrow({ where: { code } });
    }
    async getCommentType(tx, code) {
        return tx.commentType.findUniqueOrThrow({ where: { code } });
    }
    async getParticipantRoleType(tx, code) {
        return tx.participantRoleType.findUniqueOrThrow({ where: { code } });
    }
};
exports.RequestWorkflowService = RequestWorkflowService;
exports.RequestWorkflowService = RequestWorkflowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RequestWorkflowService);
//# sourceMappingURL=request-workflow.service.js.map