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
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const requests_service_1 = require("./requests.service");
const request_workflow_service_1 = require("./request-workflow.service");
const request_dto_1 = require("./dto/request.dto");
const reviewer_resolution_dto_1 = require("./dto/reviewer-resolution.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const editable_state_guard_1 = require("../common/guards/editable-state.guard");
const eligibility_guard_1 = require("../common/guards/eligibility.guard");
const ownership_guard_1 = require("../common/guards/ownership.guard");
const request_dto_2 = require("./dto/request.dto");
let RequestsController = class RequestsController {
    requestsService;
    workflowService;
    constructor(requestsService, workflowService) {
        this.requestsService = requestsService;
        this.workflowService = workflowService;
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
    async update(id, dto) {
        return this.requestsService.update(id, dto);
    }
    async clone(id, req) {
        return this.requestsService.clone(id, req.user.id);
    }
    async submit(id, req) {
        return this.workflowService.submit(id, req.user.id);
    }
    async approve(id, req, body) {
        return this.workflowService.approve(id, req.user.id, body.comment);
    }
    async reject(id, req, body) {
        return this.workflowService.reject(id, req.user.id, body.comment);
    }
    async cancel(id, req, body) {
        return this.workflowService.cancel(id, req.user.id, body.comment);
    }
    async reassign(id, req, body) {
        return this.workflowService.reassign(id, req.user.id, body.targetUserId);
    }
    async confirm(id, req, body) {
        return this.workflowService.confirm(id, req.user.id, body.comment);
    }
    async reserve(id, req) {
        return this.workflowService.reserve(id, req.user.id);
    }
    async issue(id, req) {
        return this.workflowService.issue(id, req.user.id);
    }
    getEligibleReviewers(id) {
        return this.requestsService.resolveEligibleReviewers(id);
    }
    getAssignments(id, all) {
        return this.requestsService.getAssignments(id, all);
    }
    async createAssignments(id, req, dto) {
        return this.requestsService.createAssignments(id, req.user.id, dto.stageId, dto.userIds);
    }
    async getLines(id) {
        return this.requestsService.getLines(id);
    }
    async addLine(id, dto) {
        return this.requestsService.addLine(id, dto);
    }
    async updateLine(lid, dto) {
        return this.requestsService.updateLine(lid, dto.quantity);
    }
    async removeLine(lid) {
        return this.requestsService.removeLine(lid);
    }
    async getEvents(id) {
        return this.requestsService.getEvents(id);
    }
    async getParticipants(id) {
        return this.requestsService.getParticipants(id);
    }
    async getReservations(id) {
        return this.requestsService.getReservations(id);
    }
    async getComments(id) {
        return this.requestsService.getComments(id);
    }
    async addComment(id, req, body) {
        return this.requestsService.addComment(id, req.user.id, body.body);
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('requests.create'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_dto_1.CreateRequestDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('requests.read'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('requests.read'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(editable_state_guard_1.EditableStateGuard, ownership_guard_1.OwnershipGuard),
    (0, permissions_decorator_1.Permissions)('requests.update'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_dto_2.UpdateRequestDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/clone'),
    (0, permissions_decorator_1.Permissions)('requests.clone'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "clone", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, common_1.UseGuards)(eligibility_guard_1.EligibilityGuard),
    (0, permissions_decorator_1.Permissions)('requests.submit'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, common_1.UseGuards)(eligibility_guard_1.EligibilityGuard),
    (0, permissions_decorator_1.Permissions)('requests.approve'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, common_1.UseGuards)(eligibility_guard_1.EligibilityGuard),
    (0, permissions_decorator_1.Permissions)('requests.reject'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, common_1.UseGuards)(ownership_guard_1.OwnershipGuard),
    (0, permissions_decorator_1.Permissions)('requests.cancel'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':id/reassign'),
    (0, common_1.UseGuards)(ownership_guard_1.OwnershipGuard),
    (0, permissions_decorator_1.Permissions)('requests.reassign'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "reassign", null);
__decorate([
    (0, common_1.Post)(':id/confirm'),
    (0, common_1.UseGuards)(ownership_guard_1.OwnershipGuard),
    (0, permissions_decorator_1.Permissions)('requests.confirm'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)(':id/fulfillment/reserve'),
    (0, common_1.UseGuards)(eligibility_guard_1.EligibilityGuard),
    (0, permissions_decorator_1.Permissions)('requests.reserve'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "reserve", null);
__decorate([
    (0, common_1.Post)(':id/fulfillment/issue'),
    (0, common_1.UseGuards)(eligibility_guard_1.EligibilityGuard),
    (0, permissions_decorator_1.Permissions)('requests.issue'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "issue", null);
__decorate([
    (0, common_1.Get)(':id/reviewers'),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve eligible reviewers for the current stage' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "getEligibleReviewers", null);
__decorate([
    (0, common_1.Get)(':id/assignments'),
    (0, swagger_1.ApiOperation)({ summary: 'List current assignments for a request' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('all')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], RequestsController.prototype, "getAssignments", null);
__decorate([
    (0, common_1.Post)(':id/assignments'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign specific reviewers to the current stage' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, reviewer_resolution_dto_1.CreateAssignmentsDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "createAssignments", null);
__decorate([
    (0, common_1.Get)(':id/lines'),
    (0, permissions_decorator_1.Permissions)('requests.read'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getLines", null);
__decorate([
    (0, common_1.Post)(':id/lines'),
    (0, common_1.UseGuards)(editable_state_guard_1.EditableStateGuard, ownership_guard_1.OwnershipGuard),
    (0, permissions_decorator_1.Permissions)('requests.lines.manage'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_dto_2.RequestLineDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "addLine", null);
__decorate([
    (0, common_1.Patch)(':id/lines/:lid'),
    (0, common_1.UseGuards)(editable_state_guard_1.EditableStateGuard, ownership_guard_1.OwnershipGuard),
    (0, permissions_decorator_1.Permissions)('requests.lines.manage'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('lid')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_dto_2.PatchRequestLineDto]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "updateLine", null);
__decorate([
    (0, common_1.Post)(':id/lines/:lid/remove'),
    (0, common_1.UseGuards)(editable_state_guard_1.EditableStateGuard, ownership_guard_1.OwnershipGuard),
    (0, permissions_decorator_1.Permissions)('requests.lines.manage'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('lid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "removeLine", null);
__decorate([
    (0, common_1.Get)(':id/events'),
    (0, permissions_decorator_1.Permissions)('requests.read'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getEvents", null);
__decorate([
    (0, common_1.Get)(':id/participants'),
    (0, permissions_decorator_1.Permissions)('requests.read'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getParticipants", null);
__decorate([
    (0, common_1.Get)(':id/reservations'),
    (0, permissions_decorator_1.Permissions)('requests.read'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getReservations", null);
__decorate([
    (0, common_1.Get)(':id/comments'),
    (0, permissions_decorator_1.Permissions)('comments.read'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    (0, permissions_decorator_1.Permissions)('comments.create'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "addComment", null);
exports.RequestsController = RequestsController = __decorate([
    (0, swagger_1.ApiTags)('requests'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('requests'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [requests_service_1.RequestsService,
        request_workflow_service_1.RequestWorkflowService])
], RequestsController);
//# sourceMappingURL=requests.controller.js.map