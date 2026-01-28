import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStocktakeDto {
    @ApiProperty({
        example: 'Q1 2026 Warehouse Audit',
        description: 'Name/reference for the stocktake',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'Store location ID to perform stocktake',
    })
    @IsString()
    @IsNotEmpty()
    locationId: string;
}

export class StocktakeLineDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Item ID being counted',
    })
    @IsString()
    @IsNotEmpty()
    itemId: string;

    @ApiProperty({
        example: 47,
        description: 'Actual counted quantity',
    })
    @IsNumber()
    @IsNotEmpty()
    countedQuantity: number;

    @ApiPropertyOptional({
        example: 'Found 2 damaged units',
        description: 'Optional notes for this line',
    })
    @IsString()
    @IsOptional()
    notes?: string;
}

export class SubmitStocktakeCountDto {
    @ApiProperty({
        type: () => StocktakeLineDto,
        isArray: true,
        description: 'Stocktake count lines',
        example: [
            { itemId: '123e4567-e89b-12d3-a456-426614174001', countedQuantity: 47, notes: 'Found 2 damaged' },
            { itemId: '123e4567-e89b-12d3-a456-426614174002', countedQuantity: 120 },
        ],
    })
    @ValidateNested({ each: true })
    @Type(() => StocktakeLineDto)
    lines: StocktakeLineDto[];
}
