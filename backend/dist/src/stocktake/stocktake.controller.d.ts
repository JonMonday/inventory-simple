import { StocktakeService } from './stocktake.service';
import { CreateStocktakeDto, SubmitStocktakeCountDto } from './dto/stocktake.dto';
export declare class StocktakeController {
    private readonly stocktakeService;
    constructor(stocktakeService: StocktakeService);
    create(req: any, dto: CreateStocktakeDto): Promise<{
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
        locationId: string;
        status: string;
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
        locationId: string;
        status: string;
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
        locationId: string;
        status: string;
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
