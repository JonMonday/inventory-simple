import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        example: 'john.doe@gra.local',
        description: 'User email address',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'Full name',
    })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({
        example: 'johndoe',
        description: 'Username',
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: 'password123',
        description: 'Initial password',
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Department ID',
    })
    @IsString()
    @IsOptional()
    departmentId?: string;

    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174002',
        description: 'Unit ID',
    })
    @IsString()
    @IsOptional()
    unitId?: string;

    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174003',
        description: 'Job role ID',
    })
    @IsString()
    @IsOptional()
    jobRoleId?: string;
}

export class UpdateUserDto {
    @ApiPropertyOptional({
        example: 'John M. Doe',
        description: 'Updated full name',
    })
    @IsString()
    @IsOptional()
    fullName?: string;

    @ApiPropertyOptional({
        example: 'john.doe.updated@gra.local',
        description: 'Updated email',
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174004',
        description: 'Updated department ID',
    })
    @IsString()
    @IsOptional()
    departmentId?: string;

    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174005',
        description: 'Updated unit ID',
    })
    @IsString()
    @IsOptional()
    unitId?: string;

    @ApiPropertyOptional({
        example: '123e4567-e89b-12d3-a456-426614174006',
        description: 'Updated job role ID',
    })
    @IsString()
    @IsOptional()
    jobRoleId?: string;
}

export class AssignRoleDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'Role ID to assign',
    })
    @IsString()
    @IsNotEmpty()
    roleId: string;
}

export class CreateRoleDto {
    @ApiProperty({
        example: 'Warehouse Manager',
        description: 'Role name',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        example: 'Manages warehouse operations and inventory',
        description: 'Role description',
    })
    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateRoleDto {
    @ApiPropertyOptional({
        example: 'Senior Warehouse Manager',
        description: 'Updated role name',
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        example: 'Updated description',
        description: 'Updated role description',
    })
    @IsString()
    @IsOptional()
    description?: string;
}

export class AssignPermissionDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174020',
        description: 'Permission ID to assign',
    })
    @IsString()
    @IsNotEmpty()
    permissionId: string;
}
