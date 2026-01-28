import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReturnDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Item ID to return',
    })
    @IsString()
    @IsNotEmpty()
    itemId: string;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'Location returning from (e.g., user location)',
    })
    @IsString()
    @IsNotEmpty()
    fromLocationId: string;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174011',
        description: 'Location returning to (e.g., warehouse)',
    })
    @IsString()
    @IsNotEmpty()
    toLocationId: string;

    @ApiProperty({
        example: 3,
        description: 'Quantity to return (must be at least 1)',
        minimum: 1,
    })
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174020',
        description: 'Reason code ID for the return',
    })
    @IsString()
    @IsNotEmpty()
    reasonCodeId: string;

    @ApiPropertyOptional({
        example: 'Item no longer needed',
        description: 'Additional comments',
    })
    @IsString()
    @IsOptional()
    comments?: string;
}
