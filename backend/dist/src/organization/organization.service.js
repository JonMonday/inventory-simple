"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrganizationService = class OrganizationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBranches() { return this.prisma.branch.findMany({ orderBy: { name: 'asc' } }); }
    async getBranch(id) {
        const b = await this.prisma.branch.findUnique({ where: { id } });
        if (!b)
            throw new common_1.NotFoundException('Branch not found');
        return b;
    }
    async createBranch(dto) { return this.prisma.branch.create({ data: dto }); }
    async updateBranch(id, dto) { return this.prisma.branch.update({ where: { id }, data: dto }); }
    async activateBranch(id) { return this.prisma.branch.update({ where: { id }, data: { isActive: true } }); }
    async deactivateBranch(id) { return this.prisma.branch.update({ where: { id }, data: { isActive: false } }); }
    async getDepartments(branchId) {
        return this.prisma.department.findMany({
            where: { branchId },
            include: { branch: true },
            orderBy: { name: 'asc' }
        });
    }
    async getDepartment(id) {
        const d = await this.prisma.department.findUnique({ where: { id }, include: { branch: true } });
        if (!d)
            throw new common_1.NotFoundException('Department not found');
        return d;
    }
    async createDepartment(dto) { return this.prisma.department.create({ data: dto }); }
    async updateDepartment(id, dto) { return this.prisma.department.update({ where: { id }, data: dto }); }
    async activateDepartment(id) { return this.prisma.department.update({ where: { id }, data: { isActive: true } }); }
    async deactivateDepartment(id) { return this.prisma.department.update({ where: { id }, data: { isActive: false } }); }
    async getUnits(departmentId) {
        return this.prisma.unit.findMany({
            where: { departmentId },
            include: { department: true },
            orderBy: { name: 'asc' }
        });
    }
    async getUnit(id) {
        const u = await this.prisma.unit.findUnique({ where: { id }, include: { department: true } });
        if (!u)
            throw new common_1.NotFoundException('Unit not found');
        return u;
    }
    async createUnit(dto) { return this.prisma.unit.create({ data: dto }); }
    async updateUnit(id, dto) { return this.prisma.unit.update({ where: { id }, data: dto }); }
    async activateUnit(id) { return this.prisma.unit.update({ where: { id }, data: { isActive: true } }); }
    async deactivateUnit(id) { return this.prisma.unit.update({ where: { id }, data: { isActive: false } }); }
    async getJobRoles(unitId) {
        return this.prisma.jobRole.findMany({
            where: { unitId },
            include: { unit: true },
            orderBy: { name: 'asc' }
        });
    }
    async getJobRole(id) {
        const jr = await this.prisma.jobRole.findUnique({ where: { id }, include: { unit: true } });
        if (!jr)
            throw new common_1.NotFoundException('Job role not found');
        return jr;
    }
    async createJobRole(dto) { return this.prisma.jobRole.create({ data: dto }); }
    async updateJobRole(id, dto) { return this.prisma.jobRole.update({ where: { id }, data: dto }); }
    async activateJobRole(id) { return this.prisma.jobRole.update({ where: { id }, data: { isActive: true } }); }
    async deactivateJobRole(id) { return this.prisma.jobRole.update({ where: { id }, data: { isActive: false } }); }
    async getStoreLocations() {
        return this.prisma.storeLocation.findMany({ include: { branch: true }, orderBy: { name: 'asc' } });
    }
    async getStoreLocation(id) {
        const sl = await this.prisma.storeLocation.findUnique({ where: { id }, include: { branch: true } });
        if (!sl)
            throw new common_1.NotFoundException('Store location not found');
        return sl;
    }
    async createStoreLocation(dto) { return this.prisma.storeLocation.create({ data: dto }); }
    async updateStoreLocation(id, dto) { return this.prisma.storeLocation.update({ where: { id }, data: dto }); }
    async activateStoreLocation(id) { return this.prisma.storeLocation.update({ where: { id }, data: { isActive: true } }); }
    async deactivateStoreLocation(id) { return this.prisma.storeLocation.update({ where: { id }, data: { isActive: false } }); }
    async getCategories() {
        return this.prisma.category.findMany({ include: { parentCategory: true }, orderBy: { name: 'asc' } });
    }
    async getCategory(id) {
        const c = await this.prisma.category.findUnique({ where: { id }, include: { parentCategory: true, childCategories: true } });
        if (!c)
            throw new common_1.NotFoundException('Category not found');
        return c;
    }
    async createCategory(dto) { return this.prisma.category.create({ data: dto }); }
    async updateCategory(id, dto) { return this.prisma.category.update({ where: { id }, data: dto }); }
    async activateCategory(id) { return this.prisma.category.update({ where: { id }, data: { isActive: true } }); }
    async deactivateCategory(id) { return this.prisma.category.update({ where: { id }, data: { isActive: false } }); }
    async getReasonCodes() { return this.prisma.reasonCode.findMany({ orderBy: { name: 'asc' } }); }
    async getReasonCode(id) {
        const rc = await this.prisma.reasonCode.findUnique({ where: { id } });
        if (!rc)
            throw new common_1.NotFoundException('Reason code not found');
        return rc;
    }
    async createReasonCode(dto) { return this.prisma.reasonCode.create({ data: dto }); }
    async updateReasonCode(id, dto) { return this.prisma.reasonCode.update({ where: { id }, data: dto }); }
    async activateReasonCode(id) { return this.prisma.reasonCode.update({ where: { id }, data: { isActive: true } }); }
    async deactivateReasonCode(id) { return this.prisma.reasonCode.update({ where: { id }, data: { isActive: false } }); }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrganizationService);
//# sourceMappingURL=organization.service.js.map