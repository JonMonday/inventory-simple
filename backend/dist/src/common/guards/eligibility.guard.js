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
exports.EligibilityGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let EligibilityGuard = class EligibilityGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const httpRequest = context.switchToHttp().getRequest();
        const requestId = httpRequest.params.id;
        const user = httpRequest.user;
        if (!user)
            return false;
        const dbRequest = await this.prisma.request.findUnique({
            where: { id: requestId },
            include: {
                template: true,
                currentStageType: true,
                status: true,
            },
        });
        if (!dbRequest) {
            throw new common_1.NotFoundException('Request not found');
        }
        let targetStageId = dbRequest.currentStageTypeId;
        if (dbRequest.status.code === 'DRAFT' || dbRequest.status.code === 'REJECTED') {
            const unitReviewStage = await this.prisma.requestStageType.findUnique({
                where: { code: 'UNIT_REVIEW' },
            });
            targetStageId = unitReviewStage?.id || null;
        }
        if (!targetStageId) {
            return true;
        }
        const step = await this.prisma.templateWorkflowStep.findFirst({
            where: {
                templateId: dbRequest.templateId,
                stageTypeId: targetStageId,
            },
        });
        if (!step) {
            const activeAssignment = await this.prisma.requestAssignment.findFirst({
                where: { requestId: dbRequest.id, status: 'ACTIVE' },
            });
            if (activeAssignment && activeAssignment.assignedToId !== user.id) {
                throw new common_1.ForbiddenException('You are not currently assigned to this request');
            }
            return true;
        }
        if (step.departmentId && user.departmentId !== step.departmentId) {
            throw new common_1.ForbiddenException('Your department is not eligible for this workflow stage');
        }
        if (step.unitId && user.unitId !== step.unitId) {
            throw new common_1.ForbiddenException('Your unit is not eligible for this workflow stage');
        }
        if (step.jobRoleId && user.jobRoleId !== step.jobRoleId) {
            throw new common_1.ForbiddenException('Your job role is not eligible for this workflow stage');
        }
        return true;
    }
};
exports.EligibilityGuard = EligibilityGuard;
exports.EligibilityGuard = EligibilityGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EligibilityGuard);
//# sourceMappingURL=eligibility.guard.js.map