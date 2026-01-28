import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import {
    CreateBranchDto, CreateDepartmentDto, CreateJobRoleDto, CreateStoreLocationDto, CreateUnitDto,
    UpdateBranchDto, UpdateDepartmentDto, UpdateJobRoleDto, UpdateStoreLocationDto, UpdateUnitDto
} from './dto/org-entities.dto';
import { CreateCategoryDto, CreateReasonCodeDto, UpdateCategoryDto, UpdateReasonCodeDto } from './dto/catalog-entities.dto';

@Controller()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class OrganizationController {
    constructor(private readonly orgService: OrganizationService) { }

    // ========================================================================
    // BRANCHES (6 Routes)
    // ========================================================================
    @Get('branches')
    @Permissions('branches.read')
    async getBranches() { return this.orgService.getBranches(); }

    @Get('branches/:id')
    @Permissions('branches.read')
    async getBranch(@Param('id') id: string) { return this.orgService.getBranch(id); }

    @Post('branches')
    @Permissions('branches.create')
    async createBranch(@Body() dto: CreateBranchDto) { return this.orgService.createBranch(dto); }

    @Patch('branches/:id')
    @Permissions('branches.update')
    async updateBranch(@Param('id') id: string, @Body() dto: UpdateBranchDto) { return this.orgService.updateBranch(id, dto); }

    @Post('branches/:id/activate')
    @Permissions('branches.activate')
    async activateBranch(@Param('id') id: string) { return this.orgService.activateBranch(id); }

    @Post('branches/:id/deactivate')
    @Permissions('branches.deactivate')
    async deactivateBranch(@Param('id') id: string) { return this.orgService.deactivateBranch(id); }

    // ========================================================================
    // DEPARTMENTS (6 Routes)
    // ========================================================================
    @Get('departments')
    @Permissions('departments.read')
    async getDepartments(@Query('branchId') branchId?: string) { return this.orgService.getDepartments(branchId); }

    @Get('departments/:id')
    @Permissions('departments.read')
    async getDepartment(@Param('id') id: string) { return this.orgService.getDepartment(id); }

    @Post('departments')
    @Permissions('departments.create')
    async createDepartment(@Body() dto: CreateDepartmentDto) { return this.orgService.createDepartment(dto); }

    @Patch('departments/:id')
    @Permissions('departments.update')
    async updateDepartment(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) { return this.orgService.updateDepartment(id, dto); }

    @Post('departments/:id/activate')
    @Permissions('departments.activate')
    async activateDepartment(@Param('id') id: string) { return this.orgService.activateDepartment(id); }

    @Post('departments/:id/deactivate')
    @Permissions('departments.deactivate')
    async deactivateDepartment(@Param('id') id: string) { return this.orgService.deactivateDepartment(id); }

    // ========================================================================
    // UNITS (6 Routes)
    // ========================================================================
    @Get('units')
    @Permissions('units.read')
    async getUnits(@Query('departmentId') departmentId?: string) { return this.orgService.getUnits(departmentId); }

    @Get('units/:id')
    @Permissions('units.read')
    async getUnit(@Param('id') id: string) { return this.orgService.getUnit(id); }

    @Post('units')
    @Permissions('units.create')
    async createUnit(@Body() dto: CreateUnitDto) { return this.orgService.createUnit(dto); }

    @Patch('units/:id')
    @Permissions('units.update')
    async updateUnit(@Param('id') id: string, @Body() dto: UpdateUnitDto) { return this.orgService.updateUnit(id, dto); }

    @Post('units/:id/activate')
    @Permissions('units.activate')
    async activateUnit(@Param('id') id: string) { return this.orgService.activateUnit(id); }

    @Post('units/:id/deactivate')
    @Permissions('units.deactivate')
    async deactivateUnit(@Param('id') id: string) { return this.orgService.deactivateUnit(id); }

    // ========================================================================
    // JOB ROLES (6 Routes)
    // ========================================================================
    @Get('job-roles')
    @Permissions('jobRoles.read')
    async getJobRoles(@Query('unitId') unitId?: string) { return this.orgService.getJobRoles(unitId); }

    @Get('job-roles/:id')
    @Permissions('jobRoles.read')
    async getJobRole(@Param('id') id: string) { return this.orgService.getJobRole(id); }

    @Post('job-roles')
    @Permissions('jobRoles.create')
    async createJobRole(@Body() dto: CreateJobRoleDto) { return this.orgService.createJobRole(dto); }

    @Patch('job-roles/:id')
    @Permissions('jobRoles.update')
    async updateJobRole(@Param('id') id: string, @Body() dto: UpdateJobRoleDto) { return this.orgService.updateJobRole(id, dto); }

    @Post('job-roles/:id/activate')
    @Permissions('jobRoles.activate')
    async activateJobRole(@Param('id') id: string) { return this.orgService.activateJobRole(id); }

    @Post('job-roles/:id/deactivate')
    @Permissions('jobRoles.deactivate')
    async deactivateJobRole(@Param('id') id: string) { return this.orgService.deactivateJobRole(id); }

    // ========================================================================
    // STORE LOCATIONS (6 Routes)
    // ========================================================================
    @Get('store-locations')
    @Permissions('storeLocations.read')
    async getStoreLocations() { return this.orgService.getStoreLocations(); }

    @Get('store-locations/:id')
    @Permissions('storeLocations.read')
    async getStoreLocation(@Param('id') id: string) { return this.orgService.getStoreLocation(id); }

    @Post('store-locations')
    @Permissions('storeLocations.create')
    async createStoreLocation(@Body() dto: CreateStoreLocationDto) { return this.orgService.createStoreLocation(dto); }

    @Patch('store-locations/:id')
    @Permissions('storeLocations.update')
    async updateStoreLocation(@Param('id') id: string, @Body() dto: UpdateStoreLocationDto) { return this.orgService.updateStoreLocation(id, dto); }

    @Post('store-locations/:id/activate')
    @Permissions('storeLocations.activate')
    async activateStoreLocation(@Param('id') id: string) { return this.orgService.activateStoreLocation(id); }

    @Post('store-locations/:id/deactivate')
    @Permissions('storeLocations.deactivate')
    async deactivateStoreLocation(@Param('id') id: string) { return this.orgService.deactivateStoreLocation(id); }

    // ========================================================================
    // CATEGORIES (6 Routes)
    // ========================================================================
    @Get('categories')
    @Permissions('categories.read')
    async getCategories() { return this.orgService.getCategories(); }

    @Get('categories/:id')
    @Permissions('categories.read')
    async getCategory(@Param('id') id: string) { return this.orgService.getCategory(id); }

    @Post('categories')
    @Permissions('categories.create')
    async createCategory(@Body() dto: CreateCategoryDto) { return this.orgService.createCategory(dto); }

    @Patch('categories/:id')
    @Permissions('categories.update')
    async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) { return this.orgService.updateCategory(id, dto); }

    @Post('categories/:id/activate')
    @Permissions('categories.activate')
    async activateCategory(@Param('id') id: string) { return this.orgService.activateCategory(id); }

    @Post('categories/:id/deactivate')
    @Permissions('categories.deactivate')
    async deactivateCategory(@Param('id') id: string) { return this.orgService.deactivateCategory(id); }

    // ========================================================================
    // REASON CODES (6 Routes)
    // ========================================================================
    @Get('reason-codes')
    @Permissions('reasonCodes.read')
    async getReasonCodes() { return this.orgService.getReasonCodes(); }

    @Get('reason-codes/:id')
    @Permissions('reasonCodes.read')
    async getReasonCode(@Param('id') id: string) { return this.orgService.getReasonCode(id); }

    @Post('reason-codes')
    @Permissions('reasonCodes.create')
    async createReasonCode(@Body() dto: CreateReasonCodeDto) { return this.orgService.createReasonCode(dto); }

    @Patch('reason-codes/:id')
    @Permissions('reasonCodes.update')
    async updateReasonCode(@Param('id') id: string, @Body() dto: UpdateReasonCodeDto) { return this.orgService.updateReasonCode(id, dto); }

    @Post('reason-codes/:id/activate')
    @Permissions('reasonCodes.activate')
    async activateReasonCode(@Param('id') id: string) { return this.orgService.activateReasonCode(id); }

    @Post('reason-codes/:id/deactivate')
    @Permissions('reasonCodes.deactivate')
    async deactivateReasonCode(@Param('id') id: string) { return this.orgService.deactivateReasonCode(id); }
}
