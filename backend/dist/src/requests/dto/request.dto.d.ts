export declare class RequestLineDto {
    itemId: string;
    quantity: number;
}
export declare class CreateRequestDto {
    lines: RequestLineDto[];
    comments?: string;
}
export declare class UpdateRequestLinesDto {
    lines: RequestLineDto[];
    reason?: string;
}
export declare class ReassignRequestDto {
    newUserId: string;
    newLocationId?: string;
    reason?: string;
}
export declare enum RequestStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    IN_REVIEW = "IN_REVIEW",
    IN_APPROVAL = "IN_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    FULFILLED = "FULFILLED",
    CANCELLED = "CANCELLED"
}
