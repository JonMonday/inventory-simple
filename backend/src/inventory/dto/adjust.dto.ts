import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdjustDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Item ID to adjust',
    })
    @IsString()
    @IsNotEmpty()
    itemId: string;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'Store location ID',
    })
    @IsString()
    @IsNotEmpty()
    storeLocationId: string;

    @ApiProperty({
        example: -5,
        description: 'Quantity adjustment (can be negative for shrinkage, positive for found stock)',
    })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174020',
        description: 'Reason code ID for the adjustment',
    })
    @IsString()
    @IsNotEmpty()
    reasonCodeId: string;

    @ApiPropertyOptional({
        example: 'Damaged during inspection',
        description: 'Additional reason text',
    })
    @IsString()
    @IsOptional()
    reasonText?: string;
}
