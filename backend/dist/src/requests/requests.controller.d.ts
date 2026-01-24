import { RequestsService } from './requests.service';
import { CreateRequestDto, UpdateRequestLinesDto, ReassignRequestDto } from './dto/request.dto';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(req: any, dto: CreateRequestDto): Promise<{
        lines: {
            id: string;
            itemId: string;
            quantity: number;
            requestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        departmentId: string | null;
        locationId: string | null;
        updatedAt: Date;
        status: string;
        readableId: string;
        requesterUserId: string;
        issueFromLocationId: string | null;
    }>;
    findAll(req: any): Promise<({
        requester: {
            id: string;
            createdAt: Date;
            email: string;
            passwordHash: string;
            fullName: string;
            departmentId: string | null;
            locationId: string | null;
            mustChangePassword: boolean;
            isActive: boolean;
            updatedAt: Date;
            branchId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        departmentId: string | null;
        locationId: string | null;
        updatedAt: Date;
        status: string;
        readableId: string;
        requesterUserId: string;
        issueFromLocationId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        lines: ({
            item: {
                id: string;
                description: string | null;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                code: string;
                categoryId: string;
                unitOfMeasure: string;
                status: string;
                reorderLevel: number | null;
                reorderQuantity: number | null;
            };
        } & {
            id: string;
            itemId: string;
            quantity: number;
            requestId: string;
        })[];
        assignments: ({
            user: {
                fullName: string;
            };
        } & {
            id: string;
            isActive: boolean;
            userId: string;
            assignedAt: Date;
            level: string;
            completedAt: Date | null;
            requestId: string;
        })[];
        events: ({
            user: {
                fullName: string;
            } | null;
        } & {
            id: string;
            description: string;
            createdAt: Date;
            userId: string | null;
            type: string;
            dataJson: string | null;
            requestId: string;
        })[];
        requester: {
            email: string;
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        departmentId: string | null;
        locationId: string | null;
        updatedAt: Date;
        status: string;
        readableId: string;
        requesterUserId: string;
        issueFromLocationId: string | null;
    }>;
    submit(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        departmentId: string | null;
        locationId: string | null;
        updatedAt: Date;
        status: string;
        readableId: string;
        requesterUserId: string;
        issueFromLocationId: string | null;
    }>;
    startReview(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        departmentId: string | null;
        locationId: string | null;
        updatedAt: Date;
        status: string;
        readableId: string;
        requesterUserId: string;
        issueFromLocationId: string | null;
    }>;
    refactor(id: string, req: any, dto: UpdateRequestLinesDto): Promise<{
        lines: {
            id: string;
            itemId: string;
            quantity: number;
            requestId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        departmentId: string | null;
        locationId: string | null;
        updatedAt: Date;
        status: string;
        readableId: string;
        requesterUserId: string;
        issueFromLocationId: string | null;
    }>;
    sendToApproval(id: string, req: any, issueFromLocationId?: string): Promise<void>;
    approve(id: string, req: any): Promise<void>;
    reject(id: string, req: any): Promise<void>;
    reassign(id: string, req: any, dto: ReassignRequestDto): Promise<{
        message: string;
    }>;
    fulfill(id: string, req: any): Promise<{
        success: boolean;
    }>;
    cancel(id: string, req: any): Promise<void>;
    revertToReview(id: string, req: any): Promise<void>;
}
