import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AvailabilityCheckDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Item ID to check availability',
    })
    @IsString()
    @IsNotEmpty()
    itemId: string;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'Store location ID to check',
    })
    @IsString()
    @IsNotEmpty()
    storeLocationId: string;

    @ApiProperty({
        example: 25,
        description: 'Quantity needed (must be at least 1)',
        minimum: 1,
    })
    @IsNumber()
    @Min(1)
    quantity: number;
}
