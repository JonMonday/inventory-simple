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
exports.UpdateItemDto = exports.CreateItemDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateItemDto {
    code;
    name;
    description;
    categoryId;
    unitOfMeasure;
    reorderLevel;
    reorderQuantity;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String }, name: { required: true, type: () => String }, description: { required: false, type: () => String }, categoryId: { required: true, type: () => String }, unitOfMeasure: { required: true, type: () => String }, reorderLevel: { required: false, type: () => Number, minimum: 0 }, reorderQuantity: { required: false, type: () => Number, minimum: 1 } };
    }
}
exports.CreateItemDto = CreateItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'PEN-BLK-001',
        description: 'Unique item code',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateItemDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Black Ballpoint Pen',
        description: 'Item name',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Standard office ballpoint pen, black ink',
        description: 'Item description',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Category ID',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateItemDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'EACH',
        description: 'Unit of measure (e.g., EACH, BOX, KG)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateItemDto.prototype, "unitOfMeasure", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 50,
        description: 'Minimum stock level before reorder alert',
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateItemDto.prototype, "reorderLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 100,
        description: 'Quantity to reorder when below reorder level',
        minimum: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateItemDto.prototype, "reorderQuantity", void 0);
class UpdateItemDto {
    name;
    description;
    categoryId;
    unitOfMeasure;
    status;
    reorderLevel;
    reorderQuantity;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String }, description: { required: false, type: () => String }, categoryId: { required: false, type: () => String }, unitOfMeasure: { required: false, type: () => String }, status: { required: false, type: () => String }, reorderLevel: { required: false, type: () => Number, minimum: 0 }, reorderQuantity: { required: false, type: () => Number, minimum: 1 } };
    }
}
exports.UpdateItemDto = UpdateItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Premium Black Ballpoint Pen',
        description: 'Updated item name',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Premium quality ballpoint pen with smooth ink flow',
        description: 'Updated item description',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174002',
        description: 'Updated category ID',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateItemDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'BOX',
        description: 'Updated unit of measure',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateItemDto.prototype, "unitOfMeasure", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'ACTIVE',
        description: 'Item status',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateItemDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 75,
        description: 'Updated reorder level',
        minimum: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateItemDto.prototype, "reorderLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 150,
        description: 'Updated reorder quantity',
        minimum: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateItemDto.prototype, "reorderQuantity", void 0);
//# sourceMappingURL=item.dto.js.map