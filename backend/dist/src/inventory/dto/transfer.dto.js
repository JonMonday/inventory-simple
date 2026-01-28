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
exports.TransferDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class TransferDto {
    itemId;
    fromStoreLocationId;
    toStoreLocationId;
    quantity;
    reasonCodeId;
    reasonText;
    static _OPENAPI_METADATA_FACTORY() {
        return { itemId: { required: true, type: () => String }, fromStoreLocationId: { required: true, type: () => String }, toStoreLocationId: { required: true, type: () => String }, quantity: { required: true, type: () => Number, minimum: 1 }, reasonCodeId: { required: true, type: () => String }, reasonText: { required: false, type: () => String } };
    }
}
exports.TransferDto = TransferDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Item ID to transfer',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TransferDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'Source store location ID',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TransferDto.prototype, "fromStoreLocationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174011',
        description: 'Destination store location ID',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TransferDto.prototype, "toStoreLocationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 50,
        description: 'Quantity to transfer (must be at least 1)',
        minimum: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], TransferDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174020',
        description: 'Reason code ID for the transfer',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TransferDto.prototype, "reasonCodeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Restocking branch office',
        description: 'Additional reason text',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TransferDto.prototype, "reasonText", void 0);
//# sourceMappingURL=transfer.dto.js.map