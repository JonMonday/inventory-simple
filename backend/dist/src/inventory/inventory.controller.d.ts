import { InventoryService } from './inventory.service';
import { RestockDto } from './dto/restock.dto';
import { ReturnDto } from './dto/return.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    receive(req: any, dto: RestockDto): Promise<any[]>;
    return(req: any, dto: ReturnDto): Promise<any>;
    getLocations(): Promise<{
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
    getReasonCodes(): Promise<({
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
}
