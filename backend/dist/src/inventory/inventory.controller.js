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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const inventory_service_1 = require("./inventory.service");
const restock_dto_1 = require("./dto/restock.dto");
const return_dto_1 = require("./dto/return.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const permissions_guard_1 = require("../common/guards/permissions.guard");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async receive(req, dto) {
        return this.inventoryService.receive(req.user.id, dto);
    }
    async return(req, dto) {
        return this.inventoryService.returnStock(req.user.id, dto);
    }
    async getLocations() {
        return this.inventoryService.findAllLocations();
    }
    async getReasonCodes() {
        return this.inventoryService.findAllReasonCodes();
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)('receive'),
    (0, permissions_decorator_1.Permissions)('inventory.receive'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, restock_dto_1.RestockDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "receive", null);
__decorate([
    (0, common_1.Post)('return'),
    (0, permissions_decorator_1.Permissions)('inventory.return'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, return_dto_1.ReturnDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "return", null);
__decorate([
    (0, common_1.Get)('locations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getLocations", null);
__decorate([
    (0, common_1.Get)('reason-codes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getReasonCodes", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map