export declare class CreateStocktakeDto {
    name: string;
    locationId: string;
}
export declare class StocktakeLineDto {
    itemId: string;
    countedQuantity: number;
    notes?: string;
}
export declare class SubmitStocktakeCountDto {
    lines: StocktakeLineDto[];
}
