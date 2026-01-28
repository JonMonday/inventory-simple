import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBranchDto {
    @ApiProperty({ example: 'HQ', description: 'Branch code' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'Headquarters', description: 'Branch name' })
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class UpdateBranchDto {
    @ApiPropertyOptional({ example: 'Headquarters - Main Office', description: 'Updated branch name' })
    @IsString()
    @IsOptional()
    name?: string;
}

export class CreateDepartmentDto {
    @ApiProperty({ example: 'IT', description: 'Department code' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'Information Technology', description: 'Department name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001', description: 'Parent branch ID' })
    @IsString()
    @IsNotEmpty()
    branchId: string;

    @ApiPropertyOptional({ example: 'Manages IT infrastructure and systems', description: 'Department description' })
    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateDepartmentDto {
    @ApiPropertyOptional({ example: 'IT & Digital Services', description: 'Updated department name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: 'Updated description', description: 'Updated department description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174002', description: 'Updated branch ID' })
    @IsString()
    @IsOptional()
    branchId?: string;
}

export class CreateUnitDto {
    @ApiProperty({ example: 'ITSUP', description: 'Unit code' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'IT Support', description: 'Unit name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001', description: 'Parent department ID' })
    @IsString()
    @IsNotEmpty()
    departmentId: string;

    @ApiPropertyOptional({ example: 'Provides technical support', description: 'Unit description' })
    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateUnitDto {
    @ApiPropertyOptional({ example: 'IT Support & Helpdesk', description: 'Updated unit name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: 'Updated description', description: 'Updated unit description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174002', description: 'Updated department ID' })
    @IsString()
    @IsOptional()
    departmentId?: string;
}

export class CreateJobRoleDto {
    @ApiProperty({ example: 'SYSADMIN', description: 'Job role code' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'System Administrator', description: 'Job role name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001', description: 'Parent unit ID' })
    @IsString()
    @IsNotEmpty()
    unitId: string;

    @ApiPropertyOptional({ example: 'Manages system infrastructure', description: 'Job role description' })
    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateJobRoleDto {
    @ApiPropertyOptional({ example: 'Senior System Administrator', description: 'Updated job role name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: 'Updated description', description: 'Updated job role description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174002', description: 'Updated unit ID' })
    @IsString()
    @IsOptional()
    unitId?: string;
}

export class CreateStoreLocationDto {
    @ApiProperty({ example: 'WH01', description: 'Store location code' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'Main Warehouse', description: 'Store location name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001', description: 'Parent branch ID' })
    @IsString()
    @IsNotEmpty()
    branchId: string;
}

export class UpdateStoreLocationDto {
    @ApiPropertyOptional({ example: 'Main Warehouse - Building A', description: 'Updated store location name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174002', description: 'Updated branch ID' })
    @IsString()
    @IsOptional()
    branchId?: string;
}
