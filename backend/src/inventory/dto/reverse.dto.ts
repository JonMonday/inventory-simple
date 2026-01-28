import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReverseDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174020',
        description: 'Reason code ID for the reversal',
    })
    @IsString()
    @IsNotEmpty()
    reasonCodeId: string;

    @ApiPropertyOptional({
        example: 'Incorrect ledger entry - reversing',
        description: 'Additional notes for the reversal',
    })
    @IsString()
    @IsOptional()
    notes?: string;
}
