import { IsArray, IsNotEmpty, IsString, IsNumber, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class RequestLineDto {
    @IsString()
    @IsNotEmpty()
    itemId: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}

export class CreateRequestDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestLineDto)
    lines: RequestLineDto[];

    @IsString()
    @IsOptional()
    comments?: string;
}

export class UpdateRequestLinesDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestLineDto)
    lines: RequestLineDto[];

    @IsString()
    @IsOptional()
    reason?: string;
}

export class ReassignRequestDto {
    @IsString()
    @IsNotEmpty()
    newUserId: string;

    @IsString()
    @IsOptional()
    reason?: string;
}

export enum RequestStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    IN_REVIEW = 'IN_REVIEW',
    IN_APPROVAL = 'IN_APPROVAL',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    FULFILLED = 'FULFILLED',
    CANCELLED = 'CANCELLED',
}
