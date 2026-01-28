import { InventoryService } from './inventory.service';
import { RestockDto } from './dto/restock.dto';
import { ReturnDto } from './dto/return.dto';
import { TransferDto } from './dto/transfer.dto';
import { AdjustDto } from './dto/adjust.dto';
import { AvailabilityCheckDto } from './dto/availability.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    receive(req: any, dto: RestockDto): Promise<{
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
    return(req: any, dto: ReturnDto): Promise<{
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
    transfer(req: any, dto: TransferDto): Promise<{
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
    adjust(req: any, dto: AdjustDto): Promise<{
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
    checkAvailability(dto: AvailabilityCheckDto): Promise<{
        available: boolean;
        quantityOnHand: number;
        reservedQuantity: number;
        readyToIssue: number;
    }>;
    getSnapshots(query: {
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
    getSnapshot(iid: string, sid: string): Promise<{
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
    getLocations(): Promise<({
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
    getReasonCodes(): Promise<{
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
}
export declare class ReservationsController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
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
