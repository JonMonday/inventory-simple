export declare class ReportQueryDto {
    startDate?: string;
    endDate?: string;
    locationId?: string;
    itemId?: string;
    search?: string;
}
export declare class LedgerQueryDto {
    itemId?: string;
    storeLocationId?: string;
    movementTypeId?: string;
    startDate?: string;
    endDate?: string;
}
export declare class ReservationQueryDto {
    itemId?: string;
    storeLocationId?: string;
    status?: string;
    requestId?: string;
}
export declare class ItemQueryDto {
    categoryId?: string;
    status?: string;
    search?: string;
}
