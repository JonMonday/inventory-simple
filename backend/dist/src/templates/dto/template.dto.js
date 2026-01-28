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
exports.UpdateWorkflowStagesDto = exports.UpdateTemplateDto = exports.CreateTemplateDto = exports.WorkflowStageDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class WorkflowStageDto {
    stageTypeId;
    order;
    enabled;
    static _OPENAPI_METADATA_FACTORY() {
        return { stageTypeId: { required: true, type: () => String }, order: { required: true, type: () => Number }, enabled: { required: false, type: () => Boolean } };
    }
}
exports.WorkflowStageDto = WorkflowStageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Stage type ID',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WorkflowStageDto.prototype, "stageTypeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Display order of this stage',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], WorkflowStageDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Whether this stage is enabled',
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], WorkflowStageDto.prototype, "enabled", void 0);
class CreateTemplateDto {
    name;
    description;
    stages;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, description: { required: false, type: () => String }, stages: { required: true, type: () => [require("./template.dto").WorkflowStageDto] } };
    }
}
exports.CreateTemplateDto = CreateTemplateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Standard Office Supplies Request',
        description: 'Template name',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Default template for office supply requests',
        description: 'Template description',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => WorkflowStageDto,
        isArray: true,
        description: 'Workflow stages for this template',
        example: [
            { stageTypeId: '123e4567-e89b-12d3-a456-426614174001', order: 1, enabled: true },
            { stageTypeId: '123e4567-e89b-12d3-a456-426614174002', order: 2, enabled: true },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => WorkflowStageDto),
    __metadata("design:type", Array)
], CreateTemplateDto.prototype, "stages", void 0);
class UpdateTemplateDto {
    name;
    description;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, description: { required: false, type: () => String } };
    }
}
exports.UpdateTemplateDto = UpdateTemplateDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Updated Office Supplies Request Template',
        description: 'Updated template name',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTemplateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Updated description',
        description: 'Updated template description',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTemplateDto.prototype, "description", void 0);
class UpdateWorkflowStagesDto {
    stages;
    static _OPENAPI_METADATA_FACTORY() {
        return { stages: { required: true, type: () => [require("./template.dto").WorkflowStageDto] } };
    }
}
exports.UpdateWorkflowStagesDto = UpdateWorkflowStagesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => WorkflowStageDto,
        isArray: true,
        description: 'Updated workflow stages',
        example: [
            { stageTypeId: '123e4567-e89b-12d3-a456-426614174001', order: 1, enabled: true },
            { stageTypeId: '123e4567-e89b-12d3-a456-426614174002', order: 2, enabled: false },
            { stageTypeId: '123e4567-e89b-12d3-a456-426614174003', order: 3, enabled: true },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => WorkflowStageDto),
    __metadata("design:type", Array)
], UpdateWorkflowStagesDto.prototype, "stages", void 0);
//# sourceMappingURL=template.dto.js.map