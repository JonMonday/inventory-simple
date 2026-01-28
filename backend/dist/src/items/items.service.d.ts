import { PrismaService } from '../prisma/prisma.service';
export declare class ItemsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filters?: {
        categoryId?: string;
        status?: string;
        search?: string;
    }): Promise<({
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
    create(data: {
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
    update(id: string, data: {
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
    getStockLevels(itemId: string): Promise<({
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
    findAllCategories(): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        updatedAt: Date;
        parentCategoryId: string | null;
    }[]>;
}
