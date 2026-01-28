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
exports.SubmitStocktakeCountDto = exports.StocktakeLineDto = exports.CreateStocktakeDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CreateStocktakeDto {
    name;
    locationId;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, locationId: { required: true, type: () => String } };
    }
}
exports.CreateStocktakeDto = CreateStocktakeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Q1 2026 Warehouse Audit',
        description: 'Name/reference for the stocktake',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStocktakeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'Store location ID to perform stocktake',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStocktakeDto.prototype, "locationId", void 0);
class StocktakeLineDto {
    itemId;
    countedQuantity;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { itemId: { required: true, type: () => String }, countedQuantity: { required: true, type: () => Number }, notes: { required: false, type: () => String } };
    }
}
exports.StocktakeLineDto = StocktakeLineDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Item ID being counted',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], StocktakeLineDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 47,
        description: 'Actual counted quantity',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], StocktakeLineDto.prototype, "countedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Found 2 damaged units',
        description: 'Optional notes for this line',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StocktakeLineDto.prototype, "notes", void 0);
class SubmitStocktakeCountDto {
    lines;
    static _OPENAPI_METADATA_FACTORY() {
        return { lines: { required: true, type: () => [require("./stocktake.dto").StocktakeLineDto] } };
    }
}
exports.SubmitStocktakeCountDto = SubmitStocktakeCountDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => StocktakeLineDto,
        isArray: true,
        description: 'Stocktake count lines',
        example: [
            { itemId: '123e4567-e89b-12d3-a456-426614174001', countedQuantity: 47, notes: 'Found 2 damaged' },
            { itemId: '123e4567-e89b-12d3-a456-426614174002', countedQuantity: 120 },
        ],
    }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StocktakeLineDto),
    __metadata("design:type", Array)
], SubmitStocktakeCountDto.prototype, "lines", void 0);
//# sourceMappingURL=stocktake.dto.js.map