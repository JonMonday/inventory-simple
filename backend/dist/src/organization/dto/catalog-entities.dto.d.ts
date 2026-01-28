export declare class CreateCategoryDto {
    name: string;
    description?: string;
    parentCategoryId?: string;
}
export declare class UpdateCategoryDto {
    name?: string;
    description?: string;
    parentCategoryId?: string;
}
export declare class CreateReasonCodeDto {
    code: string;
    name: string;
    description?: string;
    requiresFreeText?: boolean;
    requiresApproval?: boolean;
    approvalThreshold?: number;
}
export declare class UpdateReasonCodeDto {
    name?: string;
    description?: string;
    requiresFreeText?: boolean;
    requiresApproval?: boolean;
    approvalThreshold?: number;
}
