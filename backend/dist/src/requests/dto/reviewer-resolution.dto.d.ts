import { AssignmentMode, AssignmentStatus, AssignmentType } from '@prisma/client';
export declare class EligibleReviewerDto {
    id: string;
    fullName: string;
    email: string;
    departmentName?: string;
    unitName?: string;
    branchName?: string;
    roleCodes: string[];
}
export declare class ReviewerResolutionResponseDto {
    stageId: string;
    assignmentMode: AssignmentMode;
    roleKey: string;
    eligibleUsers: EligibleReviewerDto[];
    constraints: any;
}
export declare class CreateAssignmentsDto {
    stageId: string;
    userIds: string[];
}
export declare class RequestAssignmentDto {
    id: string;
    assignmentType: AssignmentType;
    status: AssignmentStatus;
    assignedToId?: string;
    assignedToName?: string;
    assignedRoleKey?: string;
    assignedAt: Date;
    completedAt?: Date;
}
