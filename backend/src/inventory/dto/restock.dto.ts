import { IsArray, IsNotEmpty, IsString, IsNumber, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RestockLineDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Item ID to restock',
    })
    @IsString()
    @IsNotEmpty()
    itemId: string;

    @ApiProperty({
        example: 100,
        description: 'Quantity to receive',
    })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({
        example: 25.50,
        description: 'Unit cost for this item',
    })
    @IsNumber()
    @IsNotEmpty()
    unitCost: number;
}

export class RestockDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'Store location ID to receive stock',
    })
    @IsString()
    @IsNotEmpty()
    locationId: string;

    @ApiProperty({
        type: () => RestockLineDto,
        isArray: true,
        description: 'Items being restocked',
        example: [
            { itemId: '123e4567-e89b-12d3-a456-426614174001', quantity: 100, unitCost: 25.50 },
            { itemId: '123e4567-e89b-12d3-a456-426614174002', quantity: 50, unitCost: 15.75 },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RestockLineDto)
    lines: RestockLineDto[];

    @ApiPropertyOptional({
        example: 'PO-2026-001',
        description: 'Purchase order or delivery reference number',
    })
    @IsString()
    @IsOptional()
    referenceNo?: string;

    @ApiPropertyOptional({
        example: 'Quarterly stock replenishment',
        description: 'Additional comments',
    })
    @IsString()
    @IsOptional()
    comments?: string;
}
