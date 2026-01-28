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
exports.LookupsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const lookup_registry_guard_1 = require("../common/guards/lookup-registry.guard");
const prisma_service_1 = require("../prisma/prisma.service");
let LookupsController = class LookupsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listTables() {
        return [
            'request_statuses',
            'request_stage_types',
            'request_event_types',
            'comment_types',
            'participant_role_types',
            'ledger_movement_types',
            'stocktake_statuses',
            'item_statuses'
        ];
    }
    async getTableData(name) {
        return this.prisma[name].findMany({ orderBy: { label: 'asc' } });
    }
    async createEntry(name, body) {
        return this.prisma[name].create({ data: body });
    }
    async updateEntry(name, id, body) {
        return this.prisma[name].update({ where: { id }, data: body });
    }
    async activateEntry(name, id) {
        return this.prisma[name].update({ where: { id }, data: { isActive: true } });
    }
    async deactivateEntry(name, id) {
        return this.prisma[name].update({ where: { id }, data: { isActive: false } });
    }
};
exports.LookupsController = LookupsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('lookups.read'),
    openapi.ApiResponse({ status: 200, type: [String] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LookupsController.prototype, "listTables", null);
__decorate([
    (0, common_1.Get)(':name'),
    (0, permissions_decorator_1.Permissions)('lookups.read'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LookupsController.prototype, "getTableData", null);
__decorate([
    (0, common_1.Post)(':name'),
    (0, permissions_decorator_1.Permissions)('lookups.manage'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LookupsController.prototype, "createEntry", null);
__decorate([
    (0, common_1.Patch)(':name/:id'),
    (0, permissions_decorator_1.Permissions)('lookups.manage'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LookupsController.prototype, "updateEntry", null);
__decorate([
    (0, common_1.Post)(':name/:id/activate'),
    (0, permissions_decorator_1.Permissions)('lookups.manage'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LookupsController.prototype, "activateEntry", null);
__decorate([
    (0, common_1.Post)(':name/:id/deactivate'),
    (0, permissions_decorator_1.Permissions)('lookups.manage'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LookupsController.prototype, "deactivateEntry", null);
exports.LookupsController = LookupsController = __decorate([
    (0, common_1.Controller)('lookups'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permissions_guard_1.PermissionsGuard, lookup_registry_guard_1.LookupRegistryGuard),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LookupsController);
//# sourceMappingURL=lookups.controller.js.map