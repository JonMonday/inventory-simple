import { PrismaService } from '../prisma/prisma.service';
import { RestockDto } from './dto/restock.dto';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    recordMovement(tx: any, data: {
        itemId: string;
        locationId: string;
        movementType: 'RECEIVE' | 'ISSUE' | 'ADJUSTMENT' | 'TRANSFER' | 'REVERSAL' | 'RETURN';
        quantity: number;
        reasonCodeId: string;
        reasonText?: string;
        referenceNo?: string;
        unitCost?: number;
        userId: string;
        comments?: string;
        relatedLocationId?: string;
        reversalOfLedgerId?: string;
    }): Promise<any>;
    reverseLedgerEntry(tx: any, ledgerId: string, userId: string, reasonCodeId: string, notes?: string): Promise<void>;
    private validateReasonPolicy;
    receive(userId: string, dto: RestockDto): Promise<any[]>;
    returnStock(userId: string, data: {
        itemId: string;
        fromLocationId: string;
        toLocationId: string;
        quantity: number;
        reasonCodeId: string;
        comments?: string;
    }): Promise<any>;
    findAllLocations(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        isActive: boolean;
        updatedAt: Date;
        branchId: string;
        code: string;
        type: string;
        parentLocationId: string | null;
    }[]>;
    findAllReasonCodes(): Promise<({
        allowedMovements: {
            movementType: string;
            reasonCodeId: string;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        isActive: boolean;
        code: string;
        requiresApproval: boolean;
        requiresFreeText: boolean;
        approvalThreshold: number | null;
        label: string | null;
    })[]>;
    findAllLedger(filters?: {
        itemId?: string;
        locationId?: string;
        movementType?: string;
    }): Promise<({
        reasonCode: {
            id: string;
            description: string | null;
            createdAt: Date;
            name: string;
            isActive: boolean;
            code: string;
            requiresApproval: boolean;
            requiresFreeText: boolean;
            approvalThreshold: number | null;
            label: string | null;
        };
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
        createdBy: {
            email: string;
            fullName: string;
        };
        toLocation: {
            id: string;
            createdAt: Date;
            name: string;
            isActive: boolean;
            updatedAt: Date;
            branchId: string;
            code: string;
            type: string;
            parentLocationId: string | null;
        } | null;
        fromLocation: {
            id: string;
            createdAt: Date;
            name: string;
            isActive: boolean;
            updatedAt: Date;
            branchId: string;
            code: string;
            type: string;
            parentLocationId: string | null;
        } | null;
    } & {
        id: string;
        department: string | null;
        movementType: string;
        unitOfMeasure: string;
        itemId: string;
        quantity: number;
        reasonText: string | null;
        referenceNo: string | null;
        useBy: string | null;
        suppliedBy: string | null;
        receivedBy: string | null;
        comments: string | null;
        createdAtUtc: Date;
        source: string;
        unitCost: number | null;
        totalCost: number | null;
        fromLocationId: string | null;
        toLocationId: string | null;
        reasonCodeId: string;
        createdByUserId: string;
        importJobId: string | null;
        correctionOfLedgerId: string | null;
        reversalOfLedgerId: string | null;
    })[]>;
}
