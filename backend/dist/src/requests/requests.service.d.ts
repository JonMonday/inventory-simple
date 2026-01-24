import { PrismaService } from '../prisma/prisma.service';
import { ReservationService } from '../inventory/reservation.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateRequestDto, UpdateRequestLinesDto, ReassignRequestDto } from './dto/request.dto';
export declare class RequestsService {
    private prisma;
    private reservationService;
    private inventoryService;
    constructor(prisma: PrismaService, reservationService: ReservationService, inventoryService: InventoryService);
    create(userId: string, dto: CreateRequestDto): Promise<{
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
    submit(id: string, userId: string): Promise<{
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
    findAll(userId?: string, role?: string): Promise<({
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
    startReview(id: string, userId: string): Promise<{
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
    refactor(id: string, userId: string, dto: UpdateRequestLinesDto): Promise<{
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
    sendToApproval(id: string, userId: string, issueFromLocationId?: string): Promise<void>;
    reassign(id: string, actorId: string, isAdmin: boolean, dto: ReassignRequestDto): Promise<{
        message: string;
    }>;
    revertToReview(id: string, userId: string): Promise<void>;
    cancel(id: string, userId: string): Promise<void>;
    approve(id: string, userId: string): Promise<void>;
    reject(id: string, userId: string): Promise<void>;
    fulfill(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
