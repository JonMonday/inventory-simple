import { ItemsService } from './items.service';
import { CreateItemDto, UpdateItemDto } from './dto/item.dto';
import { ItemQueryDto } from '../common/dto/query.dto';
export declare class ItemsController {
    private itemsService;
    constructor(itemsService: ItemsService);
    findAll(query: ItemQueryDto): Promise<({
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            updatedAt: Date;
            parentCategoryId: string | null;
        };
        stockSnapshots: ({
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
            itemId: string;
            storeLocationId: string;
            quantityOnHand: number;
            reservedQuantity: number;
            lastUpdatedAt: Date;
        })[];
    } & {
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
    })[]>;
    findOne(id: string): Promise<({
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            updatedAt: Date;
            parentCategoryId: string | null;
        };
        stockSnapshots: ({
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
            itemId: string;
            storeLocationId: string;
            quantityOnHand: number;
            reservedQuantity: number;
            lastUpdatedAt: Date;
        })[];
    } & {
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
    }) | null>;
    create(createDto: CreateItemDto): Promise<{
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            updatedAt: Date;
            parentCategoryId: string | null;
        };
    } & {
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
    }>;
    update(id: string, updateDto: UpdateItemDto): Promise<{
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            updatedAt: Date;
            parentCategoryId: string | null;
        };
    } & {
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
    }>;
    deactivate(id: string): Promise<{
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
    }>;
    reactivate(id: string): Promise<{
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
    }>;
    getStockLevels(id: string): Promise<({
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
        itemId: string;
        storeLocationId: string;
        quantityOnHand: number;
        reservedQuantity: number;
        lastUpdatedAt: Date;
    })[]>;
    getCategories(): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        parentCategoryId: string | null;
    }[]>;
}
