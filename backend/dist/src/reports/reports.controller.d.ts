import { StreamableFile } from '@nestjs/common';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getStockOnHand(query: any, res: any): Promise<({
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
    })[] | StreamableFile>;
    getMovements(query: any, res: any): Promise<StreamableFile | ({
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
        movementType: {
            label: string;
            id: string;
            description: string | null;
            code: string;
        };
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
    getLowStock(): Promise<({
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
    getRequestKPIs(): Promise<{
        totalRequests: number;
        fulfillmentRate: number;
        rejectedCount: number;
    }>;
    getAdjustmentsSummary(query: any): Promise<unknown[]>;
    private exportCsv;
}
