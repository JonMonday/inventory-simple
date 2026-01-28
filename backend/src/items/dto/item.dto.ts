import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateItemDto {
    @ApiProperty({
        example: 'PEN-BLK-001',
        description: 'Unique item code',
    })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({
        example: 'Black Ballpoint Pen',
        description: 'Item name',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        example: 'Standard office ballpoint pen, black ink',
        description: 'Item description',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Category ID',
    })
    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @ApiProperty({
        example: 'EACH',
        description: 'Unit of measure (e.g., EACH, BOX, KG)',
    })
    @IsString()
    @IsNotEmpty()
    unitOfMeasure: string;

    @ApiPropertyOptional({
        example: 50,
        description: 'Minimum stock level before reorder alert',
        minimum: 0,
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    reorderLevel?: number;

    @ApiPropertyOptional({
        example: 100,
        description: 'Quantity to reorder when below reorder level',
        minimum: 1,
    })
    @IsNumber()
    @IsOptional()
    @Min(1)
    reorderQuantity?: number;
}

export class UpdateItemDto {
    @ApiPropertyOptional({
        example: 'Premium Black Ballpoint Pen',
        description: 'Updated item name',
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        example: 'Premium quality ballpoint pen with smooth ink flow',
        description: 'Updated item description',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174002',
        description: 'Updated category ID',
    })
    @IsString()
    @IsOptional()
    categoryId?: string;

    @ApiPropertyOptional({
        example: 'BOX',
        description: 'Updated unit of measure',
    })
    @IsString()
    @IsOptional()
    unitOfMeasure?: string;

    @ApiPropertyOptional({
        example: 'ACTIVE',
        description: 'Item status',
    })
    @IsString()
    @IsOptional()
    status?: string;

    @ApiPropertyOptional({
        example: 75,
        description: 'Updated reorder level',
        minimum: 0,
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    reorderLevel?: number;

    @ApiPropertyOptional({
        example: 150,
        description: 'Updated reorder quantity',
        minimum: 1,
    })
    @IsNumber()
    @IsOptional()
    @Min(1)
    reorderQuantity?: number;
}
