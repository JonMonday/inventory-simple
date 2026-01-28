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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const organization_service_1 = require("./organization.service");
const passport_1 = require("@nestjs/passport");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const org_entities_dto_1 = require("./dto/org-entities.dto");
const catalog_entities_dto_1 = require("./dto/catalog-entities.dto");
let OrganizationController = class OrganizationController {
    orgService;
    constructor(orgService) {
        this.orgService = orgService;
    }
    async getBranches() { return this.orgService.getBranches(); }
    async getBranch(id) { return this.orgService.getBranch(id); }
    async createBranch(dto) { return this.orgService.createBranch(dto); }
    async updateBranch(id, dto) { return this.orgService.updateBranch(id, dto); }
    async activateBranch(id) { return this.orgService.activateBranch(id); }
    async deactivateBranch(id) { return this.orgService.deactivateBranch(id); }
    async getDepartments(branchId) { return this.orgService.getDepartments(branchId); }
    async getDepartment(id) { return this.orgService.getDepartment(id); }
    async createDepartment(dto) { return this.orgService.createDepartment(dto); }
    async updateDepartment(id, dto) { return this.orgService.updateDepartment(id, dto); }
    async activateDepartment(id) { return this.orgService.activateDepartment(id); }
    async deactivateDepartment(id) { return this.orgService.deactivateDepartment(id); }
    async getUnits(departmentId) { return this.orgService.getUnits(departmentId); }
    async getUnit(id) { return this.orgService.getUnit(id); }
    async createUnit(dto) { return this.orgService.createUnit(dto); }
    async updateUnit(id, dto) { return this.orgService.updateUnit(id, dto); }
    async activateUnit(id) { return this.orgService.activateUnit(id); }
    async deactivateUnit(id) { return this.orgService.deactivateUnit(id); }
    async getJobRoles(unitId) { return this.orgService.getJobRoles(unitId); }
    async getJobRole(id) { return this.orgService.getJobRole(id); }
    async createJobRole(dto) { return this.orgService.createJobRole(dto); }
    async updateJobRole(id, dto) { return this.orgService.updateJobRole(id, dto); }
    async activateJobRole(id) { return this.orgService.activateJobRole(id); }
    async deactivateJobRole(id) { return this.orgService.deactivateJobRole(id); }
    async getStoreLocations() { return this.orgService.getStoreLocations(); }
    async getStoreLocation(id) { return this.orgService.getStoreLocation(id); }
    async createStoreLocation(dto) { return this.orgService.createStoreLocation(dto); }
    async updateStoreLocation(id, dto) { return this.orgService.updateStoreLocation(id, dto); }
    async activateStoreLocation(id) { return this.orgService.activateStoreLocation(id); }
    async deactivateStoreLocation(id) { return this.orgService.deactivateStoreLocation(id); }
    async getCategories() { return this.orgService.getCategories(); }
    async getCategory(id) { return this.orgService.getCategory(id); }
    async createCategory(dto) { return this.orgService.createCategory(dto); }
    async updateCategory(id, dto) { return this.orgService.updateCategory(id, dto); }
    async activateCategory(id) { return this.orgService.activateCategory(id); }
    async deactivateCategory(id) { return this.orgService.deactivateCategory(id); }
    async getReasonCodes() { return this.orgService.getReasonCodes(); }
    async getReasonCode(id) { return this.orgService.getReasonCode(id); }
    async createReasonCode(dto) { return this.orgService.createReasonCode(dto); }
    async updateReasonCode(id, dto) { return this.orgService.updateReasonCode(id, dto); }
    async activateReasonCode(id) { return this.orgService.activateReasonCode(id); }
    async deactivateReasonCode(id) { return this.orgService.deactivateReasonCode(id); }
};
exports.OrganizationController = OrganizationController;
__decorate([
    (0, common_1.Get)('branches'),
    (0, permissions_decorator_1.Permissions)('branches.read'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getBranches", null);
__decorate([
    (0, common_1.Get)('branches/:id'),
    (0, permissions_decorator_1.Permissions)('branches.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getBranch", null);
__decorate([
    (0, common_1.Post)('branches'),
    (0, permissions_decorator_1.Permissions)('branches.create'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [org_entities_dto_1.CreateBranchDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "createBranch", null);
__decorate([
    (0, common_1.Patch)('branches/:id'),
    (0, permissions_decorator_1.Permissions)('branches.update'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, org_entities_dto_1.UpdateBranchDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "updateBranch", null);
__decorate([
    (0, common_1.Post)('branches/:id/activate'),
    (0, permissions_decorator_1.Permissions)('branches.activate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "activateBranch", null);
__decorate([
    (0, common_1.Post)('branches/:id/deactivate'),
    (0, permissions_decorator_1.Permissions)('branches.deactivate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "deactivateBranch", null);
__decorate([
    (0, common_1.Get)('departments'),
    (0, permissions_decorator_1.Permissions)('departments.read'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Get)('departments/:id'),
    (0, permissions_decorator_1.Permissions)('departments.read'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getDepartment", null);
__decorate([
    (0, common_1.Post)('departments'),
    (0, permissions_decorator_1.Permissions)('departments.create'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [org_entities_dto_1.CreateDepartmentDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "createDepartment", null);
__decorate([
    (0, common_1.Patch)('departments/:id'),
    (0, permissions_decorator_1.Permissions)('departments.update'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, org_entities_dto_1.UpdateDepartmentDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "updateDepartment", null);
__decorate([
    (0, common_1.Post)('departments/:id/activate'),
    (0, permissions_decorator_1.Permissions)('departments.activate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "activateDepartment", null);
__decorate([
    (0, common_1.Post)('departments/:id/deactivate'),
    (0, permissions_decorator_1.Permissions)('departments.deactivate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "deactivateDepartment", null);
__decorate([
    (0, common_1.Get)('units'),
    (0, permissions_decorator_1.Permissions)('units.read'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('departmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getUnits", null);
__decorate([
    (0, common_1.Get)('units/:id'),
    (0, permissions_decorator_1.Permissions)('units.read'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getUnit", null);
__decorate([
    (0, common_1.Post)('units'),
    (0, permissions_decorator_1.Permissions)('units.create'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [org_entities_dto_1.CreateUnitDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "createUnit", null);
__decorate([
    (0, common_1.Patch)('units/:id'),
    (0, permissions_decorator_1.Permissions)('units.update'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, org_entities_dto_1.UpdateUnitDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "updateUnit", null);
__decorate([
    (0, common_1.Post)('units/:id/activate'),
    (0, permissions_decorator_1.Permissions)('units.activate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "activateUnit", null);
__decorate([
    (0, common_1.Post)('units/:id/deactivate'),
    (0, permissions_decorator_1.Permissions)('units.deactivate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "deactivateUnit", null);
__decorate([
    (0, common_1.Get)('job-roles'),
    (0, permissions_decorator_1.Permissions)('jobRoles.read'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)('unitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getJobRoles", null);
__decorate([
    (0, common_1.Get)('job-roles/:id'),
    (0, permissions_decorator_1.Permissions)('jobRoles.read'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getJobRole", null);
__decorate([
    (0, common_1.Post)('job-roles'),
    (0, permissions_decorator_1.Permissions)('jobRoles.create'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [org_entities_dto_1.CreateJobRoleDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "createJobRole", null);
__decorate([
    (0, common_1.Patch)('job-roles/:id'),
    (0, permissions_decorator_1.Permissions)('jobRoles.update'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, org_entities_dto_1.UpdateJobRoleDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "updateJobRole", null);
__decorate([
    (0, common_1.Post)('job-roles/:id/activate'),
    (0, permissions_decorator_1.Permissions)('jobRoles.activate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "activateJobRole", null);
__decorate([
    (0, common_1.Post)('job-roles/:id/deactivate'),
    (0, permissions_decorator_1.Permissions)('jobRoles.deactivate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "deactivateJobRole", null);
__decorate([
    (0, common_1.Get)('store-locations'),
    (0, permissions_decorator_1.Permissions)('storeLocations.read'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getStoreLocations", null);
__decorate([
    (0, common_1.Get)('store-locations/:id'),
    (0, permissions_decorator_1.Permissions)('storeLocations.read'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getStoreLocation", null);
__decorate([
    (0, common_1.Post)('store-locations'),
    (0, permissions_decorator_1.Permissions)('storeLocations.create'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [org_entities_dto_1.CreateStoreLocationDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "createStoreLocation", null);
__decorate([
    (0, common_1.Patch)('store-locations/:id'),
    (0, permissions_decorator_1.Permissions)('storeLocations.update'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, org_entities_dto_1.UpdateStoreLocationDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "updateStoreLocation", null);
__decorate([
    (0, common_1.Post)('store-locations/:id/activate'),
    (0, permissions_decorator_1.Permissions)('storeLocations.activate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "activateStoreLocation", null);
__decorate([
    (0, common_1.Post)('store-locations/:id/deactivate'),
    (0, permissions_decorator_1.Permissions)('storeLocations.deactivate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "deactivateStoreLocation", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, permissions_decorator_1.Permissions)('categories.read'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    (0, permissions_decorator_1.Permissions)('categories.read'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getCategory", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, permissions_decorator_1.Permissions)('categories.create'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalog_entities_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    (0, permissions_decorator_1.Permissions)('categories.update'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, catalog_entities_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Post)('categories/:id/activate'),
    (0, permissions_decorator_1.Permissions)('categories.activate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "activateCategory", null);
__decorate([
    (0, common_1.Post)('categories/:id/deactivate'),
    (0, permissions_decorator_1.Permissions)('categories.deactivate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "deactivateCategory", null);
__decorate([
    (0, common_1.Get)('reason-codes'),
    (0, permissions_decorator_1.Permissions)('reasonCodes.read'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getReasonCodes", null);
__decorate([
    (0, common_1.Get)('reason-codes/:id'),
    (0, permissions_decorator_1.Permissions)('reasonCodes.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getReasonCode", null);
__decorate([
    (0, common_1.Post)('reason-codes'),
    (0, permissions_decorator_1.Permissions)('reasonCodes.create'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalog_entities_dto_1.CreateReasonCodeDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "createReasonCode", null);
__decorate([
    (0, common_1.Patch)('reason-codes/:id'),
    (0, permissions_decorator_1.Permissions)('reasonCodes.update'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, catalog_entities_dto_1.UpdateReasonCodeDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "updateReasonCode", null);
__decorate([
    (0, common_1.Post)('reason-codes/:id/activate'),
    (0, permissions_decorator_1.Permissions)('reasonCodes.activate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "activateReasonCode", null);
__decorate([
    (0, common_1.Post)('reason-codes/:id/deactivate'),
    (0, permissions_decorator_1.Permissions)('reasonCodes.deactivate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "deactivateReasonCode", null);
exports.OrganizationController = OrganizationController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [organization_service_1.OrganizationService])
], OrganizationController);
//# sourceMappingURL=organization.controller.js.map