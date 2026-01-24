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
exports.StocktakeController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const stocktake_service_1 = require("./stocktake.service");
const stocktake_dto_1 = require("./dto/stocktake.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const permissions_guard_1 = require("../common/guards/permissions.guard");
let StocktakeController = class StocktakeController {
    stocktakeService;
    constructor(stocktakeService) {
        this.stocktakeService = stocktakeService;
    }
    async create(req, dto) {
        return this.stocktakeService.create(req.user.id, dto);
    }
    async startCounting(id, req) {
        return this.stocktakeService.startCounting(id, req.user.id);
    }
    async submitCount(id, req, dto) {
        return this.stocktakeService.submitCount(id, req.user.id, dto);
    }
    async approve(id, req) {
        return this.stocktakeService.approve(id, req.user.id);
    }
    async apply(id, req) {
        return this.stocktakeService.apply(id, req.user.id);
    }
    async findOne(id) {
        return this.stocktakeService.findOne(id);
    }
    async findAll() {
        return this.stocktakeService.findAll();
    }
};
exports.StocktakeController = StocktakeController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('stocktake.create'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, stocktake_dto_1.CreateStocktakeDto]),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/start-count'),
    (0, permissions_decorator_1.Permissions)('stocktake.startCount'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "startCounting", null);
__decorate([
    (0, common_1.Post)(':id/submit-count'),
    (0, permissions_decorator_1.Permissions)('stocktake.submitCount'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, stocktake_dto_1.SubmitStocktakeCountDto]),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "submitCount", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, permissions_decorator_1.Permissions)('stocktake.approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/apply'),
    (0, permissions_decorator_1.Permissions)('stocktake.apply'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "apply", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('stocktake.read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('stocktake.read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StocktakeController.prototype, "findAll", null);
exports.StocktakeController = StocktakeController = __decorate([
    (0, common_1.Controller)('stocktakes'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [stocktake_service_1.StocktakeService])
], StocktakeController);
//# sourceMappingURL=stocktake.controller.js.map