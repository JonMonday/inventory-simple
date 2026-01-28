import { PrismaService } from '../prisma/prisma.service';
import { RestockDto } from './dto/restock.dto';
import { ReturnDto } from './dto/return.dto';
import { TransferDto } from './dto/transfer.dto';
import { AdjustDto } from './dto/adjust.dto';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    recordMovement(tx: any, data: {
        itemId: string;
        locationId: string;
        movementType: string;
        quantity: number;
        reasonCodeId: string;
        userId: string;
        referenceNo?: string;
        comments?: string;
    }): Promise<any>;
    receive(userId: string, dto: RestockDto): Promise<{
        id: string;
        department: string | null;
        comments: string | null;
        unitOfMeasure: string;
        itemId: string;
        quantity: number;
        reasonText: string | null;
        referenceNo: string | null;
        useBy: string | null;
        suppliedBy: string | null;
        receivedBy: string | null;
        createdAtUtc: Date;
        source: string;
        unitCost: number | null;
        totalCost: number | null;
        fromStoreLocationId: string | null;
        toStoreLocationId: string | null;
        movementTypeId: string;
        reasonCodeId: string;
        createdByUserId: string;
        importJobId: string | null;
        correctionOfLedgerId: string | null;
        reversalOfLedgerId: string | null;
    }[]>;
    returnStock(userId: string, dto: ReturnDto): Promise<{
        id: string;
        department: string | null;
        comments: string | null;
        unitOfMeasure: string;
        itemId: string;
        quantity: number;
        reasonText: string | null;
        referenceNo: string | null;
        useBy: string | null;
        suppliedBy: string | null;
        receivedBy: string | null;
        createdAtUtc: Date;
        source: string;
        unitCost: number | null;
        totalCost: number | null;
        fromStoreLocationId: string | null;
        toStoreLocationId: string | null;
        movementTypeId: string;
        reasonCodeId: string;
        createdByUserId: string;
        importJobId: string | null;
        correctionOfLedgerId: string | null;
        reversalOfLedgerId: string | null;
    }>;
    transfer(userId: string, dto: TransferDto): Promise<{
        id: string;
        department: string | null;
        comments: string | null;
        unitOfMeasure: string;
        itemId: string;
        quantity: number;
        reasonText: string | null;
        referenceNo: string | null;
        useBy: string | null;
        suppliedBy: string | null;
        receivedBy: string | null;
        createdAtUtc: Date;
        source: string;
        unitCost: number | null;
        totalCost: number | null;
        fromStoreLocationId: string | null;
        toStoreLocationId: string | null;
        movementTypeId: string;
        reasonCodeId: string;
        createdByUserId: string;
        importJobId: string | null;
        correctionOfLedgerId: string | null;
        reversalOfLedgerId: string | null;
    }>;
    adjust(userId: string, dto: AdjustDto): Promise<{
        id: string;
        department: string | null;
        comments: string | null;
        unitOfMeasure: string;
        itemId: string;
        quantity: number;
        reasonText: string | null;
        referenceNo: string | null;
        useBy: string | null;
        suppliedBy: string | null;
        receivedBy: string | null;
        createdAtUtc: Date;
        source: string;
        unitCost: number | null;
        totalCost: number | null;
        fromStoreLocationId: string | null;
        toStoreLocationId: string | null;
        movementTypeId: string;
        reasonCodeId: string;
        createdByUserId: string;
        importJobId: string | null;
        correctionOfLedgerId: string | null;
        reversalOfLedgerId: string | null;
    }>;
    findAllLedger(): Promise<({
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
        reasonCode: {
            label: string | null;
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            requiresFreeText: boolean;
            requiresApproval: boolean;
            approvalThreshold: number | null;
        };
        fromStoreLocation: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            branchId: string;
        } | null;
        movementType: {
            label: string;
            id: string;
            description: string | null;
            code: string;
        };
        toStoreLocation: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            branchId: string;
        } | null;
    } & {
        id: string;
        department: string | null;
        comments: string | null;
        unitOfMeasure: string;
        itemId: string;
        quantity: number;
        reasonText: string | null;
        referenceNo: string | null;
        useBy: string | null;
        suppliedBy: string | null;
        receivedBy: string | null;
        createdAtUtc: Date;
        source: string;
        unitCost: number | null;
        totalCost: number | null;
        fromStoreLocationId: string | null;
        toStoreLocationId: string | null;
        movementTypeId: string;
        reasonCodeId: string;
        createdByUserId: string;
        importJobId: string | null;
        correctionOfLedgerId: string | null;
        reversalOfLedgerId: string | null;
    })[]>;
    reverseLedgerEntry(tx: any, id: string, userId: string, reasonCodeId: string, notes?: string): Promise<any>;
    findAllLocations(): Promise<({
        branch: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
        };
    } & {
        id: string;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        updatedAt: Date;
        branchId: string;
    })[]>;
    findAllReasonCodes(): Promise<{
        label: string | null;
        id: string;
        description: string | null;
        createdAt: Date;
        isActive: boolean;
        name: string;
        code: string;
        requiresFreeText: boolean;
        requiresApproval: boolean;
        approvalThreshold: number | null;
    }[]>;
    getLedger(filters?: {
        itemId?: string;
        storeId?: string;
        type?: string;
        from?: string;
        to?: string;
    }): Promise<({
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
        reasonCode: {
            label: string | null;
            id: string;
            description: string | null;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            requiresFreeText: boolean;
            requiresApproval: boolean;
            approvalThreshold: number | null;
        };
        fromStoreLocation: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            branchId: string;
        } | null;
        movementType: {
            label: string;
            id: string;
            description: string | null;
            code: string;
        };
        toStoreLocation: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            name: string;
            code: string;
            updatedAt: Date;
            branchId: string;
        } | null;
    } & {
        id: string;
        department: string | null;
        comments: string | null;
        unitOfMeasure: string;
        itemId: string;
        quantity: number;
        reasonText: string | null;
        referenceNo: string | null;
        useBy: string | null;
        suppliedBy: string | null;
        receivedBy: string | null;
        createdAtUtc: Date;
        source: string;
        unitCost: number | null;
        totalCost: number | null;
        fromStoreLocationId: string | null;
        toStoreLocationId: string | null;
        movementTypeId: string;
        reasonCodeId: string;
        createdByUserId: string;
        importJobId: string | null;
        correctionOfLedgerId: string | null;
        reversalOfLedgerId: string | null;
    })[]>;
    getStockSnapshots(filters?: {
        itemId?: string;
        storeId?: string;
    }): Promise<({
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
    getSnapshot(itemId: string, locId: string): Promise<{
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
    }>;
    getGlobalReservations(): Promise<({
        stockSnapshot: {
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
        };
        request: {
            readableId: string;
        } | null;
        requestLine: {
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
            quantity: number;
            requestId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        itemId: string;
        storeLocationId: string;
        quantity: number;
        requestId: string | null;
        requestLineId: string;
    })[]>;
}
