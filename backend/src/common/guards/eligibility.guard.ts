import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * EligibilityGuard
 * Validates that the current user matches the organizational constraints
 * (Department, Unit, JobRole) defined in the TemplateWorkflowStep for the
 * request's current stage.
 * 
 * Applies ONLY to: submit, approve, reject, reserve, issue.
 */
@Injectable()
export class EligibilityGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpRequest = context.switchToHttp().getRequest();
        const requestId = httpRequest.params.id;
        const user = httpRequest.user;

        if (!user) return false;

        // 1. Fetch Request with Status and Current Stage
        const dbRequest = await this.prisma.request.findUnique({
            where: { id: requestId },
            include: {
                template: true,
                currentStageType: true,
                status: true,
            },
        });

        if (!dbRequest) {
            throw new NotFoundException('Request not found');
        }

        // 2. Special Case: Submit (DRAFT/REJECTED state)
        // For submit, we check specifically for the UNIT_REVIEW stage constraints in the template
        let targetStageId = dbRequest.currentStageTypeId;
        if (dbRequest.status.code === 'DRAFT' || dbRequest.status.code === 'REJECTED') {
            const unitReviewStage = await this.prisma.requestStageType.findUnique({
                where: { code: 'UNIT_REVIEW' },
            });
            targetStageId = unitReviewStage?.id || null;
        }

        if (!targetStageId) {
            // If no stage is set, we can't check eligibility via steps.
            // This might happen if the request is CLOSED/CANCELLED.
            return true;
        }

        // 3. Find the TemplateWorkflowStep for this stage
        const step = await this.prisma.templateWorkflowStep.findFirst({
            where: {
                templateId: dbRequest.templateId!,
                stageTypeId: targetStageId,
            },
        });

        if (!step) {
            // If no constraints defined for this stage in the template, 
            // we fallback to checking if user is the assigned person.
            const activeAssignment = await this.prisma.requestAssignment.findFirst({
                where: { requestId: dbRequest.id, status: 'ACTIVE' },
            });

            if (activeAssignment && activeAssignment.assignedToId !== user.id) {
                throw new ForbiddenException('You are not currently assigned to this request');
            }
            return true;
        }

        // 4. Validate user against Step Constraints
        // Department Check
        if (step.departmentId && user.departmentId !== step.departmentId) {
            throw new ForbiddenException('Your department is not eligible for this workflow stage');
        }

        // Unit Check (Note: some steps might be "requester-unit" scoped, 
        // but schema has explicit unitId FK so we follow that if present)
        if (step.unitId && user.unitId !== step.unitId) {
            throw new ForbiddenException('Your unit is not eligible for this workflow stage');
        }

        // Job Role Check
        if (step.jobRoleId && user.jobRoleId !== step.jobRoleId) {
            throw new ForbiddenException('Your job role is not eligible for this workflow stage');
        }

        return true;
    }
}
