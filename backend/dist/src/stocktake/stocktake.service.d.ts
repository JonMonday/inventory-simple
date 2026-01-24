import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateStocktakeDto, SubmitStocktakeCountDto } from './dto/stocktake.dto';
export declare class StocktakeService {
    private prisma;
    private inventoryService;
    constructor(prisma: PrismaService, inventoryService: InventoryService);
    create(userId: string, dto: CreateStocktakeDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        locationId: string;
        status: string;
        createdByUserId: string;
        completedAt: Date | null;
        startedAt: Date | null;
        approvedAt: Date | null;
        approvedByUserId: string | null;
    }>;
    startCounting(id: string, userId: string): Promise<{
        lines: {
            id: string;
            itemId: string;
            notes: string | null;
            countedQuantity: number | null;
            stocktakeId: string;
            systemQuantity: number;
            variance: number | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        locationId: string;
        status: string;
        createdByUserId: string;
        completedAt: Date | null;
        startedAt: Date | null;
        approvedAt: Date | null;
        approvedByUserId: string | null;
    }>;
    submitCount(id: string, userId: string, dto: SubmitStocktakeCountDto): Promise<{
        lines: {
            id: string;
            itemId: string;
            notes: string | null;
            countedQuantity: number | null;
            stocktakeId: string;
            systemQuantity: number;
            variance: number | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        locationId: string;
        status: string;
        createdByUserId: string;
        completedAt: Date | null;
        startedAt: Date | null;
        approvedAt: Date | null;
        approvedByUserId: string | null;
    }>;
    approve(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        locationId: string;
        status: string;
        createdByUserId: string;
        completedAt: Date | null;
        startedAt: Date | null;
        approvedAt: Date | null;
        approvedByUserId: string | null;
    }>;
    apply(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        locationId: string;
        status: string;
        createdByUserId: string;
        completedAt: Date | null;
        startedAt: Date | null;
        approvedAt: Date | null;
        approvedByUserId: string | null;
    }>;
    findOne(id: string): Promise<({
        location: {
            id: string;
            createdAt: Date;
            name: string;
            isActive: boolean;
            updatedAt: Date;
            branchId: string;
            code: string;
            type: string;
            parentLocationId: string | null;
        };
        createdBy: {
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
            notes: string | null;
            countedQuantity: number | null;
            stocktakeId: string;
            systemQuantity: number;
            variance: number | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        locationId: string;
        status: string;
        createdByUserId: string;
        completedAt: Date | null;
        startedAt: Date | null;
        approvedAt: Date | null;
        approvedByUserId: string | null;
    }) | null>;
    findAll(): Promise<({
        location: {
            id: string;
            createdAt: Date;
            name: string;
            isActive: boolean;
            updatedAt: Date;
            branchId: string;
            code: string;
            type: string;
            parentLocationId: string | null;
        };
        createdBy: {
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
        name: string;
        locationId: string;
        status: string;
        createdByUserId: string;
        completedAt: Date | null;
        startedAt: Date | null;
        approvedAt: Date | null;
        approvedByUserId: string | null;
    })[]>;
}
