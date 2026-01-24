import { InventoryService } from './inventory.service';
import { ReverseDto } from './dto/reverse.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class LedgerController {
    private readonly inventoryService;
    private readonly prisma;
    constructor(inventoryService: InventoryService, prisma: PrismaService);
    findAll(): Promise<({
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
    reverse(id: string, req: any, dto: ReverseDto): Promise<void>;
}
