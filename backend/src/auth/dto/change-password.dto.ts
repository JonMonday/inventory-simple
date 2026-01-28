import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({
        example: 'password123',
        description: 'Current password',
    })
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({
        example: 'NewPass@123',
        description: 'New password (min 8 characters)',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    newPassword: string;

    @ApiProperty({
        example: 'NewPass@123',
        description: 'Confirm new password (must match newPassword)',
    })
    @IsString()
    @IsNotEmpty()
    confirmNewPassword: string;
}
