import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    CreateBranchDto, CreateDepartmentDto, CreateJobRoleDto, CreateStoreLocationDto, CreateUnitDto,
    UpdateBranchDto, UpdateDepartmentDto, UpdateJobRoleDto, UpdateStoreLocationDto, UpdateUnitDto
} from './dto/org-entities.dto';
import { CreateCategoryDto, CreateReasonCodeDto, UpdateCategoryDto, UpdateReasonCodeDto } from './dto/catalog-entities.dto';

@Injectable()
export class OrganizationService {
    constructor(private prisma: PrismaService) { }

    // ========================================================================
    // BRANCHES
    // ========================================================================
    async getBranches() { return this.prisma.branch.findMany({ orderBy: { name: 'asc' } }); }
    async getBranch(id: string) {
        const b = await this.prisma.branch.findUnique({ where: { id } });
        if (!b) throw new NotFoundException('Branch not found');
        return b;
    }
    async createBranch(dto: CreateBranchDto) { return this.prisma.branch.create({ data: dto }); }
    async updateBranch(id: string, dto: UpdateBranchDto) { return this.prisma.branch.update({ where: { id }, data: dto }); }
    async activateBranch(id: string) { return this.prisma.branch.update({ where: { id }, data: { isActive: true } }); }
    async deactivateBranch(id: string) { return this.prisma.branch.update({ where: { id }, data: { isActive: false } }); }

    // ========================================================================
    // DEPARTMENTS
    // ========================================================================
    async getDepartments(branchId?: string) {
        return this.prisma.department.findMany({
            where: { branchId },
            include: { branch: true },
            orderBy: { name: 'asc' }
        });
    }
    async getDepartment(id: string) {
        const d = await this.prisma.department.findUnique({ where: { id }, include: { branch: true } });
        if (!d) throw new NotFoundException('Department not found');
        return d;
    }
    async createDepartment(dto: CreateDepartmentDto) { return this.prisma.department.create({ data: dto }); }
    async updateDepartment(id: string, dto: UpdateDepartmentDto) { return this.prisma.department.update({ where: { id }, data: dto }); }
    async activateDepartment(id: string) { return this.prisma.department.update({ where: { id }, data: { isActive: true } }); }
    async deactivateDepartment(id: string) { return this.prisma.department.update({ where: { id }, data: { isActive: false } }); }

    // ========================================================================
    // UNITS
    // ========================================================================
    async getUnits(departmentId?: string) {
        return this.prisma.unit.findMany({
            where: { departmentId },
            include: { department: true },
            orderBy: { name: 'asc' }
        });
    }
    async getUnit(id: string) {
        const u = await this.prisma.unit.findUnique({ where: { id }, include: { department: true } });
        if (!u) throw new NotFoundException('Unit not found');
        return u;
    }
    async createUnit(dto: CreateUnitDto) { return this.prisma.unit.create({ data: dto }); }
    async updateUnit(id: string, dto: UpdateUnitDto) { return this.prisma.unit.update({ where: { id }, data: dto }); }
    async activateUnit(id: string) { return this.prisma.unit.update({ where: { id }, data: { isActive: true } }); }
    async deactivateUnit(id: string) { return this.prisma.unit.update({ where: { id }, data: { isActive: false } }); }

    // ========================================================================
    // JOB ROLES
    // ========================================================================
    async getJobRoles(unitId?: string) {
        return this.prisma.jobRole.findMany({
            where: { unitId },
            include: { unit: true },
            orderBy: { name: 'asc' }
        });
    }
    async getJobRole(id: string) {
        const jr = await this.prisma.jobRole.findUnique({ where: { id }, include: { unit: true } });
        if (!jr) throw new NotFoundException('Job role not found');
        return jr;
    }
    async createJobRole(dto: CreateJobRoleDto) { return this.prisma.jobRole.create({ data: dto }); }
    async updateJobRole(id: string, dto: UpdateJobRoleDto) { return this.prisma.jobRole.update({ where: { id }, data: dto }); }
    async activateJobRole(id: string) { return this.prisma.jobRole.update({ where: { id }, data: { isActive: true } }); }
    async deactivateJobRole(id: string) { return this.prisma.jobRole.update({ where: { id }, data: { isActive: false } }); }

    // ========================================================================
    // STORE LOCATIONS
    // ========================================================================
    async getStoreLocations() {
        return this.prisma.storeLocation.findMany({ include: { branch: true }, orderBy: { name: 'asc' } });
    }
    async getStoreLocation(id: string) {
        const sl = await this.prisma.storeLocation.findUnique({ where: { id }, include: { branch: true } });
        if (!sl) throw new NotFoundException('Store location not found');
        return sl;
    }
    async createStoreLocation(dto: CreateStoreLocationDto) { return this.prisma.storeLocation.create({ data: dto }); }
    async updateStoreLocation(id: string, dto: UpdateStoreLocationDto) { return this.prisma.storeLocation.update({ where: { id }, data: dto }); }
    async activateStoreLocation(id: string) { return this.prisma.storeLocation.update({ where: { id }, data: { isActive: true } }); }
    async deactivateStoreLocation(id: string) { return this.prisma.storeLocation.update({ where: { id }, data: { isActive: false } }); }

    // ========================================================================
    // CATEGORIES
    // ========================================================================
    async getCategories() {
        return this.prisma.category.findMany({ include: { parentCategory: true }, orderBy: { name: 'asc' } });
    }
    async getCategory(id: string) {
        const c = await this.prisma.category.findUnique({ where: { id }, include: { parentCategory: true, childCategories: true } });
        if (!c) throw new NotFoundException('Category not found');
        return c;
    }
    async createCategory(dto: CreateCategoryDto) { return this.prisma.category.create({ data: dto }); }
    async updateCategory(id: string, dto: UpdateCategoryDto) { return this.prisma.category.update({ where: { id }, data: dto }); }
    async activateCategory(id: string) { return this.prisma.category.update({ where: { id }, data: { isActive: true } }); }
    async deactivateCategory(id: string) { return this.prisma.category.update({ where: { id }, data: { isActive: false } }); }

    // ========================================================================
    // REASON CODES
    // ========================================================================
    async getReasonCodes() { return this.prisma.reasonCode.findMany({ orderBy: { name: 'asc' } }); }
    async getReasonCode(id: string) {
        const rc = await this.prisma.reasonCode.findUnique({ where: { id } });
        if (!rc) throw new NotFoundException('Reason code not found');
        return rc;
    }
    async createReasonCode(dto: CreateReasonCodeDto) { return this.prisma.reasonCode.create({ data: dto as any }); }
    async updateReasonCode(id: string, dto: UpdateReasonCodeDto) { return this.prisma.reasonCode.update({ where: { id }, data: dto as any }); }
    async activateReasonCode(id: string) { return this.prisma.reasonCode.update({ where: { id }, data: { isActive: true } }); }
    async deactivateReasonCode(id: string) { return this.prisma.reasonCode.update({ where: { id }, data: { isActive: false } }); }
}
