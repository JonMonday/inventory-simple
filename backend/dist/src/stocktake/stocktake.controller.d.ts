import { StocktakeService } from './stocktake.service';
import { CreateStocktakeDto, SubmitStocktakeCountDto } from './dto/stocktake.dto';
export declare class StocktakeController {
    private readonly stocktakeService;
    constructor(stocktakeService: StocktakeService);
    create(req: any, dto: CreateStocktakeDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        statusId: string;
        storeLocationId: string;
        createdByUserId: string;
        completedAt: Date | null;
        startedAt: Date | null;
        approvedAt: Date | null;
        approvedByUserId: string | null;
    }>;
    startCounting(id: string, req: any): Promise<{
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
        statusId: string;
        storeLocationId: string;
        createdByUserId: string;
        completedAt: Date | null;
        startedAt: Date | null;
        approvedAt: Date | null;
        approvedByUserId: string | null;
    }>;
    submitCount(id: string, req: any, dto: SubmitStocktakeCountDto): Promise<{
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
        statusId: string;
        storeLocationId: string;
        createdByUserId: string;
        completedAt: Date | null;
        startedAt: Date | null;
        approvedAt: Date | null;
        approvedByUserId: string | null;
    }>;
    approve(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        statusId: string;
        storeLocationId: string;
        createdByUserId: string;
        completedAt: Date | null;
        startedAt: Date | null;
        approvedAt: Date | null;
        approvedByUserId: string | null;
    }>;
    apply(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        statusId: string;
        storeLocationId: string;
        createdByUserId: string;
        completedAt: Date | null;
        startedAt: Date | null;
        approvedAt: Date | null;
        approvedByUserId: string | null;
    }>;
    findOne(id: string): Promise<({
        createdBy: {
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
        status: {
            label: string;
            id: string;
            code: string;
            sortOrder: number;
        };
        storeLocation: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            branchId: string;
        };
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
        statusId: string;
        storeLocationId: string;
        createdByUserId: string;
        completedAt: Date | null;
        startedAt: Date | null;
        approvedAt: Date | null;
        approvedByUserId: string | null;
    }) | null>;
    findAll(): Promise<({
        createdBy: {
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
        status: {
            label: string;
            id: string;
            code: string;
            sortOrder: number;
        };
        storeLocation: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            branchId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        statusId: string;
        storeLocationId: string;
        createdByUserId: string;
        completedAt: Date | null;
        startedAt: Date | null;
        approvedAt: Date | null;
        approvedByUserId: string | null;
    })[]>;
}
