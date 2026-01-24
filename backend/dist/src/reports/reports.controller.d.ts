import { StreamableFile } from '@nestjs/common';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getStockOnHand(query: any, res: any): Promise<({
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
        locationId: string;
        itemId: string;
        quantityOnHand: number;
        reservedQuantity: number;
        lastUpdatedAt: Date;
    })[] | StreamableFile>;
    getMovements(query: any, res: any): Promise<StreamableFile | ({
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
    getLowStock(): Promise<({
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
        locationId: string;
        itemId: string;
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
