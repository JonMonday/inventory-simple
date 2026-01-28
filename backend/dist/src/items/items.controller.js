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
exports.ItemsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const items_service_1 = require("./items.service");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const item_dto_1 = require("./dto/item.dto");
const query_dto_1 = require("../common/dto/query.dto");
let ItemsController = class ItemsController {
    itemsService;
    constructor(itemsService) {
        this.itemsService = itemsService;
    }
    async findAll(query) {
        return this.itemsService.findAll(query);
    }
    async findOne(id) {
        return this.itemsService.findOne(id);
    }
    async create(createDto) {
        return this.itemsService.create(createDto);
    }
    async update(id, updateDto) {
        return this.itemsService.update(id, updateDto);
    }
    async deactivate(id) {
        return this.itemsService.deactivate(id);
    }
    async reactivate(id) {
        return this.itemsService.reactivate(id);
    }
    async getStockLevels(id) {
        return this.itemsService.getStockLevels(id);
    }
    async getCategories() {
        return this.itemsService.findAllCategories();
    }
};
exports.ItemsController = ItemsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('items.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all items with optional filters' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dto_1.ItemQueryDto]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('items.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get item by ID' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('items.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new item' }),
    (0, swagger_1.ApiBody)({ type: item_dto_1.CreateItemDto }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [item_dto_1.CreateItemDto]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('items.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update item' }),
    (0, swagger_1.ApiBody)({ type: item_dto_1.UpdateItemDto }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, item_dto_1.UpdateItemDto]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/deactivate'),
    (0, permissions_decorator_1.Permissions)('items.deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate item' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Post)(':id/reactivate'),
    (0, permissions_decorator_1.Permissions)('items.activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Reactivate item' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Get)(':id/stock'),
    (0, permissions_decorator_1.Permissions)('stock.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock levels for item' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "getStockLevels", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, permissions_decorator_1.Permissions)('items.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "getCategories", null);
exports.ItemsController = ItemsController = __decorate([
    (0, swagger_1.ApiTags)('catalog'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('items'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [items_service_1.ItemsService])
], ItemsController);
//# sourceMappingURL=items.controller.js.map