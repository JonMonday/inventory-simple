import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertLookupEntryDto {
    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Entry ID (for updates)',
    })
    @IsString()
    @IsOptional()
    id?: string;

    @ApiProperty({
        example: 'APPROVED',
        description: 'Lookup entry code',
    })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({
        example: 'Approved',
        description: 'Lookup entry label',
    })
    @IsString()
    @IsNotEmpty()
    label: string;

    @ApiPropertyOptional({
        example: 'Request has been approved',
        description: 'Lookup entry description',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Whether this entry is active',
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiPropertyOptional({
        example: 3,
        description: 'Display order',
    })
    @IsOptional()
    displayOrder?: number;
}
