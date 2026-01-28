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
exports.RestockDto = exports.RestockLineDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class RestockLineDto {
    itemId;
    quantity;
    unitCost;
    static _OPENAPI_METADATA_FACTORY() {
        return { itemId: { required: true, type: () => String }, quantity: { required: true, type: () => Number }, unitCost: { required: true, type: () => Number } };
    }
}
exports.RestockLineDto = RestockLineDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Item ID to restock',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RestockLineDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 100,
        description: 'Quantity to receive',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], RestockLineDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 25.50,
        description: 'Unit cost for this item',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], RestockLineDto.prototype, "unitCost", void 0);
class RestockDto {
    locationId;
    lines;
    referenceNo;
    comments;
    static _OPENAPI_METADATA_FACTORY() {
        return { locationId: { required: true, type: () => String }, lines: { required: true, type: () => [require("./restock.dto").RestockLineDto] }, referenceNo: { required: false, type: () => String }, comments: { required: false, type: () => String } };
    }
}
exports.RestockDto = RestockDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'Store location ID to receive stock',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RestockDto.prototype, "locationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => RestockLineDto,
        isArray: true,
        description: 'Items being restocked',
        example: [
            { itemId: '123e4567-e89b-12d3-a456-426614174001', quantity: 100, unitCost: 25.50 },
            { itemId: '123e4567-e89b-12d3-a456-426614174002', quantity: 50, unitCost: 15.75 },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RestockLineDto),
    __metadata("design:type", Array)
], RestockDto.prototype, "lines", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'PO-2026-001',
        description: 'Purchase order or delivery reference number',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RestockDto.prototype, "referenceNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Quarterly stock replenishment',
        description: 'Additional comments',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RestockDto.prototype, "comments", void 0);
//# sourceMappingURL=restock.dto.js.map