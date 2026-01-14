import { ItemsService } from './items.service';
export declare class ItemsController {
    private readonly itemsService;
    constructor(itemsService: ItemsService);
    findAll(): Promise<({
        snapshots: ({
            location: {
                id: string;
                description: string | null;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                type: import(".prisma/client").$Enums.LocationType;
            };
        } & {
            id: string;
            updatedAt: Date;
            itemId: string;
            quantity: number;
            locationId: string;
        })[];
        category: {
            id: string;
            name: string;
        } | null;
        uom: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        description: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        uomId: string;
        categoryId: string | null;
        discontinued: boolean;
        reorderLevel: number;
        reorderQuantity: number;
    })[]>;
    findOne(id: string): Promise<({
        snapshots: {
            id: string;
            updatedAt: Date;
            itemId: string;
            quantity: number;
            locationId: string;
        }[];
        category: {
            id: string;
            name: string;
        } | null;
        uom: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        description: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        uomId: string;
        categoryId: string | null;
        discontinued: boolean;
        reorderLevel: number;
        reorderQuantity: number;
    }) | null>;
    create(data: any): Promise<{
        id: string;
        description: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        uomId: string;
        categoryId: string | null;
        discontinued: boolean;
        reorderLevel: number;
        reorderQuantity: number;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        description: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        uomId: string;
        categoryId: string | null;
        discontinued: boolean;
        reorderLevel: number;
        reorderQuantity: number;
    }>;
}
