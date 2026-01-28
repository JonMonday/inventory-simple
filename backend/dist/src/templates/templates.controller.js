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
exports.TemplatesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const prisma_service_1 = require("../prisma/prisma.service");
let TemplatesController = class TemplatesController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.requestTemplate.findMany({
            include: { workflowSteps: { include: { stageType: true } } },
            orderBy: { isDefault: 'desc' }
        });
    }
    async findOne(id) {
        const t = await this.prisma.requestTemplate.findUnique({
            where: { id },
            include: { workflowSteps: { include: { stageType: true, department: true, unit: true, jobRole: true }, orderBy: { stepOrder: 'asc' } } }
        });
        if (!t)
            throw new common_1.NotFoundException('Template not found');
        return t;
    }
    async create(req, body) {
        return this.prisma.requestTemplate.create({
            data: {
                name: body.name,
                description: body.description,
                createdById: req.user.id,
                workflowSteps: {
                    create: (body.steps || []).map((s) => ({
                        stageTypeId: s.stageTypeId,
                        stepOrder: s.stepOrder,
                        departmentId: s.departmentId,
                        unitId: s.unitId,
                        jobRoleId: s.jobRoleId
                    }))
                }
            }
        });
    }
    async update(id, body) {
        return this.prisma.$transaction(async (tx) => {
            if (body.steps) {
                await tx.templateWorkflowStep.deleteMany({ where: { templateId: id } });
            }
            return tx.requestTemplate.update({
                where: { id },
                data: {
                    name: body.name,
                    description: body.description,
                    ...(body.steps && {
                        workflowSteps: {
                            create: body.steps.map((s) => ({
                                stageTypeId: s.stageTypeId,
                                stepOrder: s.stepOrder,
                                departmentId: s.departmentId,
                                unitId: s.unitId,
                                jobRoleId: s.jobRoleId
                            }))
                        }
                    })
                }
            });
        });
    }
    async activate(id) {
        return this.prisma.requestTemplate.update({ where: { id }, data: { isActive: true } });
    }
    async deactivate(id) {
        return this.prisma.requestTemplate.update({ where: { id }, data: { isActive: false } });
    }
    async setDefault(id) {
        return this.prisma.$transaction(async (tx) => {
            await tx.requestTemplate.updateMany({ data: { isDefault: false } });
            return tx.requestTemplate.update({ where: { id }, data: { isDefault: true } });
        });
    }
    async validate(id) {
        const template = await this.findOne(id);
        const issues = [];
        const steps = template.workflowSteps || [];
        const orders = steps.map((s) => s.stepOrder).sort((a, b) => a - b);
        for (let i = 0; i < orders.length - 1; i++) {
            if (orders[i + 1] !== orders[i] + 1) {
                issues.push(`Gap in step order detected between ${orders[i]} and ${orders[i + 1]}`);
            }
        }
        return {
            valid: issues.length === 0,
            issues,
            stepCount: steps.length
        };
    }
};
exports.TemplatesController = TemplatesController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('templates.read'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.Permissions)('templates.read'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('templates.create'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.Permissions)('templates.update'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/activate'),
    (0, permissions_decorator_1.Permissions)('templates.activate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)(':id/deactivate'),
    (0, permissions_decorator_1.Permissions)('templates.deactivate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Post)(':id/set-default'),
    (0, permissions_decorator_1.Permissions)('templates.manage'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "setDefault", null);
__decorate([
    (0, common_1.Post)(':id/validate'),
    (0, permissions_decorator_1.Permissions)('templates.read'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "validate", null);
exports.TemplatesController = TemplatesController = __decorate([
    (0, common_1.Controller)('templates'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TemplatesController);
//# sourceMappingURL=templates.controller.js.map