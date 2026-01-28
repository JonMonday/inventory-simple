import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Office Supplies', description: 'Category name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ example: 'Items for office use', description: 'Category description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174001', description: 'Parent category ID for hierarchical categories' })
    @IsString()
    @IsOptional()
    parentCategoryId?: string;
}

export class UpdateCategoryDto {
    @ApiPropertyOptional({ example: 'Office & Stationery Supplies', description: 'Updated category name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: 'Updated description', description: 'Updated category description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174002', description: 'Updated parent category ID' })
    @IsString()
    @IsOptional()
    parentCategoryId?: string;
}

export class CreateReasonCodeDto {
    @ApiProperty({ example: 'DAMAGE', description: 'Reason code identifier' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'Damaged Goods', description: 'Reason code name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ example: 'Items damaged during handling or storage', description: 'Reason code description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: true, description: 'Whether this reason code requires additional free text explanation' })
    @IsBoolean()
    @IsOptional()
    requiresFreeText?: boolean;

    @ApiPropertyOptional({ example: false, description: 'Whether transactions with this reason code require approval' })
    @IsBoolean()
    @IsOptional()
    requiresApproval?: boolean;

    @ApiPropertyOptional({ example: 1000, description: 'Monetary threshold above which approval is required' })
    @IsNumber()
    @IsOptional()
    approvalThreshold?: number;
}

export class UpdateReasonCodeDto {
    @ApiPropertyOptional({ example: 'Damaged or Defective Goods', description: 'Updated reason code name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: 'Updated description', description: 'Updated reason code description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: true, description: 'Updated free text requirement' })
    @IsBoolean()
    @IsOptional()
    requiresFreeText?: boolean;

    @ApiPropertyOptional({ example: true, description: 'Updated approval requirement' })
    @IsBoolean()
    @IsOptional()
    requiresApproval?: boolean;

    @ApiPropertyOptional({ example: 500, description: 'Updated approval threshold' })
    @IsNumber()
    @IsOptional()
    approvalThreshold?: number;
}
