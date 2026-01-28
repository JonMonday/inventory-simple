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
exports.ItemQueryDto = exports.ReservationQueryDto = exports.LedgerQueryDto = exports.ReportQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ReportQueryDto {
    startDate;
    endDate;
    locationId;
    itemId;
    search;
    static _OPENAPI_METADATA_FACTORY() {
        return { startDate: { required: false, type: () => String }, endDate: { required: false, type: () => String }, locationId: { required: false, type: () => String }, itemId: { required: false, type: () => String }, search: { required: false, type: () => String } };
    }
}
exports.ReportQueryDto = ReportQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-01-01',
        description: 'Start date for report (ISO 8601 format)',
        format: 'date',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-01-31',
        description: 'End date for report (ISO 8601 format)',
        format: 'date',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'Filter by store location ID',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "locationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Filter by item ID',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'office supplies',
        description: 'Search term',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportQueryDto.prototype, "search", void 0);
class LedgerQueryDto {
    itemId;
    storeLocationId;
    movementTypeId;
    startDate;
    endDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { itemId: { required: false, type: () => String }, storeLocationId: { required: false, type: () => String }, movementTypeId: { required: false, type: () => String }, startDate: { required: false, type: () => String }, endDate: { required: false, type: () => String } };
    }
}
exports.LedgerQueryDto = LedgerQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Filter by item ID',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LedgerQueryDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'Filter by store location ID',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LedgerQueryDto.prototype, "storeLocationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174020',
        description: 'Filter by movement type ID',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LedgerQueryDto.prototype, "movementTypeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-01-01',
        description: 'Start date (ISO 8601 format)',
        format: 'date',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LedgerQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2026-01-31',
        description: 'End date (ISO 8601 format)',
        format: 'date',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LedgerQueryDto.prototype, "endDate", void 0);
class ReservationQueryDto {
    itemId;
    storeLocationId;
    status;
    requestId;
    static _OPENAPI_METADATA_FACTORY() {
        return { itemId: { required: false, type: () => String }, storeLocationId: { required: false, type: () => String }, status: { required: false, type: () => String }, requestId: { required: false, type: () => String } };
    }
}
exports.ReservationQueryDto = ReservationQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Filter by item ID',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReservationQueryDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'Filter by store location ID',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReservationQueryDto.prototype, "storeLocationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'ACTIVE',
        description: 'Filter by reservation status',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReservationQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174030',
        description: 'Filter by request ID',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReservationQueryDto.prototype, "requestId", void 0);
class ItemQueryDto {
    categoryId;
    status;
    search;
    static _OPENAPI_METADATA_FACTORY() {
        return { categoryId: { required: false, type: () => String }, status: { required: false, type: () => String }, search: { required: false, type: () => String } };
    }
}
exports.ItemQueryDto = ItemQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Filter by category ID',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ItemQueryDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'ACTIVE',
        description: 'Filter by status',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ItemQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'pen',
        description: 'Search term for item name or code',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ItemQueryDto.prototype, "search", void 0);
//# sourceMappingURL=query.dto.js.map