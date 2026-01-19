import { ItemsService } from './items.service';
export declare class ItemsController {
    private itemsService;
    constructor(itemsService: ItemsService);
    findAll(categoryId?: string, status?: string, search?: string): Promise<({
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            parentCategoryId: string | null;
        };
    } & {
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
    })[]>;
    findOne(id: string): Promise<({
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            parentCategoryId: string | null;
        };
        stockSnapshots: ({
            location: {
                id: string;
                createdAt: Date;
                name: string;
                isActive: boolean;
                updatedAt: Date;
                code: string;
                type: string;
                parentLocationId: string | null;
            };
        } & {
            itemId: string;
            locationId: string;
            quantityOnHand: number;
            lastUpdatedAt: Date;
        })[];
    } & {
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
    }) | null>;
    create(createDto: {
        code: string;
        name: string;
        description?: string;
        categoryId: string;
        unitOfMeasure: string;
        reorderLevel?: number;
        reorderQuantity?: number;
    }): Promise<{
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            parentCategoryId: string | null;
        };
    } & {
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
    }>;
    update(id: string, updateDto: {
        name?: string;
        description?: string;
        categoryId?: string;
        unitOfMeasure?: string;
        status?: string;
        reorderLevel?: number;
        reorderQuantity?: number;
    }): Promise<{
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            parentCategoryId: string | null;
        };
    } & {
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
    }>;
    delete(id: string): Promise<{
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
    }>;
    getStockLevels(id: string): Promise<({
        location: {
            id: string;
            createdAt: Date;
            name: string;
            isActive: boolean;
            updatedAt: Date;
            code: string;
            type: string;
            parentLocationId: string | null;
        };
    } & {
        itemId: string;
        locationId: string;
        quantityOnHand: number;
        lastUpdatedAt: Date;
    })[]>;
}
