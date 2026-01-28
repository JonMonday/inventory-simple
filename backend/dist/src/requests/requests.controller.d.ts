import { RequestsService } from './requests.service';
import { RequestWorkflowService } from './request-workflow.service';
import { CreateRequestDto } from './dto/request.dto';
import { CreateAssignmentsDto } from './dto/reviewer-resolution.dto';
import { PatchRequestLineDto, RequestLineDto, UpdateRequestDto } from './dto/request.dto';
export declare class RequestsController {
    private readonly requestsService;
    private readonly workflowService;
    constructor(requestsService: RequestsService, workflowService: RequestWorkflowService);
    create(req: any, dto: CreateRequestDto): Promise<{
        status: {
            label: string;
            id: string;
            description: string | null;
            code: string;
            sortOrder: number;
            isEditable: boolean;
            isTerminal: boolean;
        };
        lines: {
            id: string;
            itemId: string;
            quantity: number;
            requestId: string;
        }[];
    } & {
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
    findAll(req: any): Promise<({
        requester: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            branchId: string;
            departmentId: string;
            unitId: string;
            email: string;
            passwordHash: string;
            fullName: string;
            jobRoleId: string;
            primaryStoreLocationId: string | null;
            mustChangePassword: boolean;
        };
        department: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            branchId: string;
        };
        status: {
            label: string;
            id: string;
            description: string | null;
            code: string;
            sortOrder: number;
            isEditable: boolean;
            isTerminal: boolean;
        };
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        requester: {
            department: {
                name: string;
            };
            email: string;
            fullName: string;
        };
        department: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            branchId: string;
        };
        unit: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            departmentId: string;
        };
        assignments: ({
            stageType: {
                label: string;
                id: string;
                description: string | null;
                code: string;
                sortOrder: number;
            } | null;
            assignedTo: {
                email: string;
                fullName: string;
            } | null;
        } & {
            id: string;
            stageTypeId: string | null;
            assignedAt: Date;
            status: import(".prisma/client").$Enums.AssignmentStatus;
            completedAt: Date | null;
            assignmentType: import(".prisma/client").$Enums.AssignmentType;
            assignedRoleKey: string | null;
            assignedToId: string | null;
            assignedById: string | null;
            requestId: string;
        })[];
        comments: ({
            commentType: {
                label: string;
                id: string;
                description: string | null;
                code: string;
            };
            author: {
                fullName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            stageTypeId: string | null;
            requestId: string;
            authorId: string;
            commentTypeId: string;
            body: string;
        })[];
        status: {
            label: string;
            id: string;
            description: string | null;
            code: string;
            sortOrder: number;
            isEditable: boolean;
            isTerminal: boolean;
        };
        events: ({
            actedBy: {
                fullName: string;
            } | null;
            comment: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                stageTypeId: string | null;
                requestId: string;
                authorId: string;
                commentTypeId: string;
                body: string;
            } | null;
            eventType: {
                label: string;
                id: string;
                description: string | null;
                code: string;
            };
        } & {
            id: string;
            createdAt: Date;
            metadata: string | null;
            eventTypeId: string;
            actedByUserId: string | null;
            fromStatusId: string | null;
            toStatusId: string | null;
            fromStageTypeId: string | null;
            toStageTypeId: string | null;
            commentId: string | null;
            requestId: string;
        })[];
        lines: ({
            item: {
                id: string;
                description: string | null;
                createdAt: Date;
                name: string;
                code: string;
                updatedAt: Date;
                categoryId: string;
                unitOfMeasure: string;
                statusId: string;
                reorderLevel: number | null;
                reorderQuantity: number | null;
            };
        } & {
            id: string;
            itemId: string;
            quantity: number;
            requestId: string;
        })[];
        currentStageType: {
            label: string;
            id: string;
            description: string | null;
            code: string;
            sortOrder: number;
        } | null;
    } & {
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
    update(id: string, dto: UpdateRequestDto): Promise<{
        status: {
            label: string;
            id: string;
            description: string | null;
            code: string;
            sortOrder: number;
            isEditable: boolean;
            isTerminal: boolean;
        };
        lines: {
            id: string;
            itemId: string;
            quantity: number;
            requestId: string;
        }[];
    } & {
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
    clone(id: string, req: any): Promise<{
        status: {
            label: string;
            id: string;
            description: string | null;
            code: string;
            sortOrder: number;
            isEditable: boolean;
            isTerminal: boolean;
        };
        lines: {
            id: string;
            itemId: string;
            quantity: number;
            requestId: string;
        }[];
    } & {
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
    submit(id: string, req: any): Promise<{
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
    approve(id: string, req: any, body: {
        comment?: string;
    }): Promise<{
        success: boolean;
    }>;
    reject(id: string, req: any, body: {
        comment: string;
    }): Promise<void>;
    cancel(id: string, req: any, body: {
        comment?: string;
    }): Promise<void>;
    reassign(id: string, req: any, body: {
        targetUserId: string;
    }): Promise<void>;
    confirm(id: string, req: any, body: {
        comment?: string;
    }): Promise<void>;
    reserve(id: string, req: any): Promise<void>;
    issue(id: string, req: any): Promise<void>;
    getEligibleReviewers(id: string): Promise<{
        stageId: string;
        stageLabel: string;
        assignmentMode: import(".prisma/client").$Enums.AssignmentMode;
        roleKey: string;
        minApprovers: number;
        maxApprovers: number;
        eligibleUsers: {
            id: string;
            fullName: string;
            email: string;
            departmentName: string;
            unitName: string;
            branchName: string;
            roleCodes: string[];
        }[];
        constraints: {
            requireAll: boolean;
            allowRequesterSelect: boolean;
        };
    }>;
    getAssignments(id: string, all?: boolean): Promise<({
        stageType: {
            label: string;
            id: string;
            description: string | null;
            code: string;
            sortOrder: number;
        } | null;
        assignedTo: {
            department: {
                name: string;
            };
            unit: {
                name: string;
            };
            email: string;
            fullName: string;
        } | null;
    } & {
        id: string;
        stageTypeId: string | null;
        assignedAt: Date;
        status: import(".prisma/client").$Enums.AssignmentStatus;
        completedAt: Date | null;
        assignmentType: import(".prisma/client").$Enums.AssignmentType;
        assignedRoleKey: string | null;
        assignedToId: string | null;
        assignedById: string | null;
        requestId: string;
    })[]>;
    createAssignments(id: string, req: any, dto: CreateAssignmentsDto): Promise<{
        id: string;
        stageTypeId: string | null;
        assignedAt: Date;
        status: import(".prisma/client").$Enums.AssignmentStatus;
        completedAt: Date | null;
        assignmentType: import(".prisma/client").$Enums.AssignmentType;
        assignedRoleKey: string | null;
        assignedToId: string | null;
        assignedById: string | null;
        requestId: string;
    }[]>;
    getLines(id: string): Promise<({
        item: {
            id: string;
            description: string | null;
            createdAt: Date;
            name: string;
            code: string;
            updatedAt: Date;
            categoryId: string;
            unitOfMeasure: string;
            statusId: string;
            reorderLevel: number | null;
            reorderQuantity: number | null;
        };
    } & {
        id: string;
        itemId: string;
        quantity: number;
        requestId: string;
    })[]>;
    addLine(id: string, dto: RequestLineDto): Promise<{
        id: string;
        itemId: string;
        quantity: number;
        requestId: string;
    }>;
    updateLine(lid: string, dto: PatchRequestLineDto): Promise<{
        id: string;
        itemId: string;
        quantity: number;
        requestId: string;
    }>;
    removeLine(lid: string): Promise<{
        id: string;
        itemId: string;
        quantity: number;
        requestId: string;
    }>;
    getEvents(id: string): Promise<({
        actedBy: {
            fullName: string;
        } | null;
        eventType: {
            label: string;
            id: string;
            description: string | null;
            code: string;
        };
    } & {
        id: string;
        createdAt: Date;
        metadata: string | null;
        eventTypeId: string;
        actedByUserId: string | null;
        fromStatusId: string | null;
        toStatusId: string | null;
        fromStageTypeId: string | null;
        toStageTypeId: string | null;
        commentId: string | null;
        requestId: string;
    })[]>;
    getParticipants(id: string): Promise<{
        roleType: {
            label: string;
            id: string;
            description: string | null;
            code: string;
        };
        user: {
            email: string;
            fullName: string;
        };
        participantRoleType: {
            label: string;
            id: string;
            description: string | null;
            code: string;
        };
        id: string;
        userId: string;
        firstSeenAt: Date;
        lastActionAt: Date;
        participantRoleTypeId: string;
        requestId: string;
    }[]>;
    getReservations(id: string): Promise<({
        requestLine: {
            item: {
                id: string;
                description: string | null;
                createdAt: Date;
                name: string;
                code: string;
                updatedAt: Date;
                categoryId: string;
                unitOfMeasure: string;
                statusId: string;
                reorderLevel: number | null;
                reorderQuantity: number | null;
            };
        } & {
            id: string;
            itemId: string;
            quantity: number;
            requestId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        itemId: string;
        storeLocationId: string;
        quantity: number;
        requestId: string | null;
        requestLineId: string;
    })[]>;
    getComments(id: string): Promise<({
        commentType: {
            label: string;
            id: string;
            description: string | null;
            code: string;
        };
        author: {
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        stageTypeId: string | null;
        requestId: string;
        authorId: string;
        commentTypeId: string;
        body: string;
    })[]>;
    addComment(id: string, req: any, body: {
        body: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        stageTypeId: string | null;
        requestId: string;
        authorId: string;
        commentTypeId: string;
        body: string;
    }>;
}
