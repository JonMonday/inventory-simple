import { IsNotEmpty, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransferDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Item ID to transfer',
    })
    @IsString()
    @IsNotEmpty()
    itemId: string;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'Source store location ID',
    })
    @IsString()
    @IsNotEmpty()
    fromStoreLocationId: string;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174011',
        description: 'Destination store location ID',
    })
    @IsString()
    @IsNotEmpty()
    toStoreLocationId: string;

    @ApiProperty({
        example: 50,
        description: 'Quantity to transfer (must be at least 1)',
        minimum: 1,
    })
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174020',
        description: 'Reason code ID for the transfer',
    })
    @IsString()
    @IsNotEmpty()
    reasonCodeId: string;

    @ApiPropertyOptional({
        example: 'Restocking branch office',
        description: 'Additional reason text',
    })
    @IsString()
    @IsOptional()
    reasonText?: string;
}
