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
exports.UpsertLookupEntryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpsertLookupEntryDto {
    id;
    code;
    label;
    description;
    isActive;
    displayOrder;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: false, type: () => String }, code: { required: true, type: () => String }, label: { required: true, type: () => String }, description: { required: false, type: () => String }, isActive: { required: false, type: () => Boolean }, displayOrder: { required: false, type: () => Number } };
    }
}
exports.UpsertLookupEntryDto = UpsertLookupEntryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Entry ID (for updates)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertLookupEntryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'APPROVED',
        description: 'Lookup entry code',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpsertLookupEntryDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Approved',
        description: 'Lookup entry label',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpsertLookupEntryDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Request has been approved',
        description: 'Lookup entry description',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpsertLookupEntryDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Whether this entry is active',
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpsertLookupEntryDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 3,
        description: 'Display order',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpsertLookupEntryDto.prototype, "displayOrder", void 0);
//# sourceMappingURL=lookup.dto.js.map