import { PrismaService } from '../prisma/prisma.service';
export declare class RequestWorkflowService {
    private prisma;
    constructor(prisma: PrismaService);
    submit(requestId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string;
        unitId: string;
        templateId: string | null;
        statusId: string;
        readableId: string;
        requesterUserId: string;
        currentStageTypeId: string | null;
        issueFromStoreId: string | null;
        submittedAt: Date | null;
    }>;
    approve(requestId: string, userId: string, commentBody?: string): Promise<{
        success: boolean;
    }>;
    reject(requestId: string, userId: string, commentBody: string): Promise<void>;
    cancel(requestId: string, userId: string, commentBody?: string): Promise<void>;
    reserve(requestId: string, userId: string): Promise<void>;
    private handleReservationFailure;
    issue(requestId: string, userId: string): Promise<void>;
    confirm(requestId: string, userId: string, commentBody?: string): Promise<void>;
    reassign(requestId: string, actorId: string, targetUserId: string): Promise<void>;
    private createStageAssignments;
    private upsertParticipant;
    private determineRoleFromStage;
    private getStatus;
    private getStageType;
    private getEventType;
    private getCommentType;
    private getParticipantRoleType;
}
