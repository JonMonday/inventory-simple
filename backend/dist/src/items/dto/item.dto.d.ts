export declare class CreateItemDto {
    code: string;
    name: string;
    description?: string;
    categoryId: string;
    unitOfMeasure: string;
    reorderLevel?: number;
    reorderQuantity?: number;
}
export declare class UpdateItemDto {
    name?: string;
    description?: string;
    categoryId?: string;
    unitOfMeasure?: string;
    status?: string;
    reorderLevel?: number;
    reorderQuantity?: number;
}
