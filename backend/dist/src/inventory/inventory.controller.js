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
exports.ReservationsController = exports.InventoryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const inventory_service_1 = require("./inventory.service");
const restock_dto_1 = require("./dto/restock.dto");
const return_dto_1 = require("./dto/return.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const transfer_dto_1 = require("./dto/transfer.dto");
const adjust_dto_1 = require("./dto/adjust.dto");
const availability_dto_1 = require("./dto/availability.dto");
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
    async transfer(req, dto) {
        return this.inventoryService.transfer(req.user.id, dto);
    }
    async adjust(req, dto) {
        return this.inventoryService.adjust(req.user.id, dto);
    }
    async checkAvailability(dto) {
        const snapshot = await this.inventoryService.getSnapshot(dto.itemId, dto.storeLocationId);
        return {
            available: (snapshot.quantityOnHand - snapshot.reservedQuantity) >= dto.quantity,
            quantityOnHand: snapshot.quantityOnHand,
            reservedQuantity: snapshot.reservedQuantity,
            readyToIssue: snapshot.quantityOnHand - snapshot.reservedQuantity
        };
    }
    async getSnapshots(query) {
        return this.inventoryService.getStockSnapshots(query);
    }
    async getSnapshot(iid, sid) {
        return this.inventoryService.getSnapshot(iid, sid);
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
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, restock_dto_1.RestockDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "receive", null);
__decorate([
    (0, common_1.Post)('return'),
    (0, permissions_decorator_1.Permissions)('inventory.return'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, return_dto_1.ReturnDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "return", null);
__decorate([
    (0, common_1.Post)('transfer'),
    (0, permissions_decorator_1.Permissions)('inventory.transfer'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, transfer_dto_1.TransferDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "transfer", null);
__decorate([
    (0, common_1.Post)('adjust'),
    (0, permissions_decorator_1.Permissions)('inventory.adjust'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, adjust_dto_1.AdjustDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "adjust", null);
__decorate([
    (0, common_1.Post)('availability'),
    (0, permissions_decorator_1.Permissions)('stock.read'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [availability_dto_1.AvailabilityCheckDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "checkAvailability", null);
__decorate([
    (0, common_1.Get)('stock-snapshots'),
    (0, permissions_decorator_1.Permissions)('stock.read'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getSnapshots", null);
__decorate([
    (0, common_1.Get)('stock-snapshots/:iid/:sid'),
    (0, permissions_decorator_1.Permissions)('stock.read'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('iid')),
    __param(1, (0, common_1.Param)('sid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getSnapshot", null);
__decorate([
    (0, common_1.Get)('locations'),
    (0, permissions_decorator_1.Permissions)('storeLocations.read'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getLocations", null);
__decorate([
    (0, common_1.Get)('reason-codes'),
    (0, permissions_decorator_1.Permissions)('reasonCodes.read'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getReasonCodes", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('inventory'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('inventory'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
let ReservationsController = class ReservationsController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async getGlobalReservations() {
        return this.inventoryService.getGlobalReservations();
    }
};
exports.ReservationsController = ReservationsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('reservations.read'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "getGlobalReservations", null);
exports.ReservationsController = ReservationsController = __decorate([
    (0, common_1.Controller)('reservations'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], ReservationsController);
//# sourceMappingURL=inventory.controller.js.map