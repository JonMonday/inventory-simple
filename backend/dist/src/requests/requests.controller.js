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
exports.RequestsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const requests_service_1 = require("./requests.service");
const request_dto_1 = require("./dto/request.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const permissions_guard_1 = require("../common/guards/permissions.guard");
let RequestsController = class RequestsController {
    requestsService;
    constructor(requestsService) {
        this.requestsService = requestsService;
    }
    async create(req, dto) {
        return this.requestsService.create(req.user.id, dto);
    }
    async findAll(req) {
        const isAdmin = req.user.roles.includes('SuperAdmin') || req.user.roles.includes('InventoryAdmin');
        return this.requestsService.findAll(req.user.id, isAdmin ? 'ADMIN' : undefined);
    }
    async findOne(id) {
        return this.requestsService.findOne(id);
    }
    async submit(id, req) {
        return this.requestsService.submit(id, req.user.id);
    }
    async startReview(id, req) {
        return this.requestsService.startReview(id, req.user.id);
    }
    async refactor(id, req, dto) {
        return this.requestsService.refactor(id, req.user.id, dto);
    }
    async sendToApproval(id, req, issueFromLocationId) {
        return this.requestsService.sendToApproval(id, req.user.id, issueFromLocationId);
    }
    async approve(id, req) {
        return this.requestsService.approve(id, req.user.id);
    }
    async reject(id, req) {
        return this.requestsService.reject(id, req.user.id);
    }
    async reassign(id, req, dto) {
        const isAdmin = req.user.roles.includes('SuperAdmin') || req.user.roles.includes('InventoryAdmin');
        return this.requestsService.reassign(id, req.user.id, isAdmin, dto);
    }
    async fulfill(id, req) {
        return this.requestsService.fulfill(id, req.user.id);
    }
    async cancel(id, req) {
        return this.requestsService.cancel(id, req.user.id);
    }
    async revertToReview(id, req) {
        return this.requestsService.revertToReview(id, req.user.id);
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('requests.create'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_dto_1.CreateRequestDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('requests.read'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('requests.read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, permissions_decorator_1.Permissions)('requests.submit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)(':id/start-review'),
    (0, permissions_decorator_1.Permissions)('requests.review.start'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "startReview", null);
__decorate([
    (0, common_1.Post)(':id/refactor'),
    (0, permissions_decorator_1.Permissions)('requests.refactor'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, request_dto_1.UpdateRequestLinesDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "refactor", null);
__decorate([
    (0, common_1.Post)(':id/send-to-approval'),
    (0, permissions_decorator_1.Permissions)('requests.sendToApproval'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)('issueFromLocationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "sendToApproval", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, permissions_decorator_1.Permissions)('requests.approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, permissions_decorator_1.Permissions)('requests.approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/reassign'),
    (0, permissions_decorator_1.Permissions)('requests.reassign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, request_dto_1.ReassignRequestDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "reassign", null);
__decorate([
    (0, common_1.Post)(':id/fulfill'),
    (0, permissions_decorator_1.Permissions)('requests.fulfill'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "fulfill", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, permissions_decorator_1.Permissions)('requests.create'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/revert-to-review'),
    (0, permissions_decorator_1.Permissions)('requests.review.start'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "revertToReview", null);
exports.RequestsController = RequestsController = __decorate([
    (0, common_1.Controller)('requests'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [requests_service_1.RequestsService])
], RequestsController);
//# sourceMappingURL=requests.controller.js.map