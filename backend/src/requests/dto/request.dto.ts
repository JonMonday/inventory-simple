import { IsArray, IsNotEmpty, IsString, IsNumber, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RequestLineDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Item ID from catalog',
    })
    @IsString()
    @IsNotEmpty()
    itemId: string;

    @ApiProperty({
        example: 10,
        description: 'Quantity requested',
    })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}

export class CreateRequestDto {
    @ApiProperty({
        type: () => RequestLineDto,
        isArray: true,
        description: 'Request line items',
        example: [
            { itemId: '123e4567-e89b-12d3-a456-426614174001', quantity: 10 },
            { itemId: '123e4567-e89b-12d3-a456-426614174002', quantity: 5 },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestLineDto)
    lines: RequestLineDto[];

    @ApiPropertyOptional({
        example: 'Urgent request for office supplies',
        description: 'Optional comments for the request',
    })
    @IsString()
    @IsOptional()
    comments?: string;

    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Optional template ID to use for workflow',
    })
    @IsString()
    @IsOptional()
    templateId?: string;
}

export class UpdateRequestDto {
    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174003',
        description: 'Store location to issue items from',
    })
    @IsString()
    @IsOptional()
    issueFromStoreId?: string;

    @ApiPropertyOptional({
        example: 'Updated delivery instructions',
        description: 'Additional comments',
    })
    @IsString()
    @IsOptional()
    comments?: string;
}

export class PatchRequestLineDto {
    @ApiProperty({
        example: 15,
        description: 'Updated quantity for the line item',
    })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}

export class UpdateRequestLinesDto {
    @ApiProperty({
        type: () => RequestLineDto,
        isArray: true,
        description: 'Updated request lines',
        example: [
            { itemId: '123e4567-e89b-12d3-a456-426614174001', quantity: 15 },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestLineDto)
    lines: RequestLineDto[];

    @ApiPropertyOptional({
        example: 'Quantity adjusted based on stock availability',
        description: 'Reason for updating lines',
    })
    @IsString()
    @IsOptional()
    reason?: string;
}

export class ReassignRequestDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174004',
        description: 'User ID to reassign the request to',
    })
    @IsString()
    @IsNotEmpty()
    newUserId: string;

    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174005',
        description: 'Optional new location for the request',
    })
    @IsString()
    @IsOptional()
    newLocationId?: string;

    @ApiPropertyOptional({
        example: 'Original assignee is on leave',
        description: 'Reason for reassignment',
    })
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
