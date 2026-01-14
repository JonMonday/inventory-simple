import { PrismaService } from '../prisma/prisma.service';
export declare class LedgerService {
    private prisma;
    constructor(prisma: PrismaService);
    createEntry(data: any): Promise<any>;
    private updateSnapshot;
    getLedger(filters: any): Promise<({
        reasonCode: {
            id: string;
            description: string;
            code: string;
        };
        item: {
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
        };
        fromLocation: {
            id: string;
            description: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.LocationType;
        } | null;
        toLocation: {
            id: string;
            description: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.LocationType;
        } | null;
        createdBy: {
            id: string;
            name: string | null;
            email: string;
            password: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        itemId: string;
        fromLocationId: string | null;
        toLocationId: string | null;
        movementType: import(".prisma/client").$Enums.MovementType;
        quantity: number;
        reasonCodeId: string;
        reasonText: string | null;
        referenceNo: string | null;
        department: string | null;
        useBy: string | null;
        suppliedBy: string | null;
        receivedBy: string | null;
        comments: string | null;
        source: string;
        importJobId: string | null;
        correctionOfId: string | null;
        createdById: string;
    })[]>;
}
