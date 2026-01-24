export declare class RestockLineDto {
    itemId: string;
    quantity: number;
    unitCost: number;
}
export declare class RestockDto {
    locationId: string;
    lines: RestockLineDto[];
    referenceNo?: string;
    comments?: string;
}
