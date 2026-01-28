import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReportQueryDto {
    @ApiPropertyOptional({
        example: '2026-01-01',
        description: 'Start date for report (ISO 8601 format)',
        format: 'date',
    })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiPropertyOptional({
        example: '2026-01-31',
        description: 'End date for report (ISO 8601 format)',
        format: 'date',
    })
    @IsDateString()
    @IsOptional()
    endDate?: string;

    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'Filter by store location ID',
    })
    @IsString()
    @IsOptional()
    locationId?: string;

    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Filter by item ID',
    })
    @IsString()
    @IsOptional()
    itemId?: string;

    @ApiPropertyOptional({
        example: 'office supplies',
        description: 'Search term',
    })
    @IsString()
    @IsOptional()
    search?: string;
}

export class LedgerQueryDto {
    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Filter by item ID',
    })
    @IsString()
    @IsOptional()
    itemId?: string;

    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'Filter by store location ID',
    })
    @IsString()
    @IsOptional()
    storeLocationId?: string;

    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174020',
        description: 'Filter by movement type ID',
    })
    @IsString()
    @IsOptional()
    movementTypeId?: string;

    @ApiPropertyOptional({
        example: '2026-01-01',
        description: 'Start date (ISO 8601 format)',
        format: 'date',
    })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiPropertyOptional({
        example: '2026-01-31',
        description: 'End date (ISO 8601 format)',
        format: 'date',
    })
    @IsDateString()
    @IsOptional()
    endDate?: string;
}

export class ReservationQueryDto {
    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Filter by item ID',
    })
    @IsString()
    @IsOptional()
    itemId?: string;

    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'Filter by store location ID',
    })
    @IsString()
    @IsOptional()
    storeLocationId?: string;

    @ApiPropertyOptional({
        example: 'ACTIVE',
        description: 'Filter by reservation status',
    })
    @IsString()
    @IsOptional()
    status?: string;

    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174030',
        description: 'Filter by request ID',
    })
    @IsString()
    @IsOptional()
    requestId?: string;
}

export class ItemQueryDto {
    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Filter by category ID',
    })
    @IsString()
    @IsOptional()
    categoryId?: string;

    @ApiPropertyOptional({
        example: 'ACTIVE',
        description: 'Filter by status',
    })
    @IsString()
    @IsOptional()
    status?: string;

    @ApiPropertyOptional({
        example: 'pen',
        description: 'Search term for item name or code',
    })
    @IsString()
    @IsOptional()
    search?: string;
}
