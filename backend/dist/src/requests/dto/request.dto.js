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
exports.RequestStatus = exports.ReassignRequestDto = exports.UpdateRequestLinesDto = exports.PatchRequestLineDto = exports.UpdateRequestDto = exports.CreateRequestDto = exports.RequestLineDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class RequestLineDto {
    itemId;
    quantity;
    static _OPENAPI_METADATA_FACTORY() {
        return { itemId: { required: true, type: () => String }, quantity: { required: true, type: () => Number } };
    }
}
exports.RequestLineDto = RequestLineDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Item ID from catalog',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RequestLineDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Quantity requested',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], RequestLineDto.prototype, "quantity", void 0);
class CreateRequestDto {
    lines;
    comments;
    templateId;
    static _OPENAPI_METADATA_FACTORY() {
        return { lines: { required: true, type: () => [require("./request.dto").RequestLineDto] }, comments: { required: false, type: () => String }, templateId: { required: false, type: () => String } };
    }
}
exports.CreateRequestDto = CreateRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => RequestLineDto,
        isArray: true,
        description: 'Request line items',
        example: [
            { itemId: '123e4567-e89b-12d3-a456-426614174001', quantity: 10 },
            { itemId: '123e4567-e89b-12d3-a456-426614174002', quantity: 5 },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RequestLineDto),
    __metadata("design:type", Array)
], CreateRequestDto.prototype, "lines", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Urgent request for office supplies',
        description: 'Optional comments for the request',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Optional template ID to use for workflow',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "templateId", void 0);
class UpdateRequestDto {
    issueFromStoreId;
    comments;
    static _OPENAPI_METADATA_FACTORY() {
        return { issueFromStoreId: { required: false, type: () => String }, comments: { required: false, type: () => String } };
    }
}
exports.UpdateRequestDto = UpdateRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174003',
        description: 'Store location to issue items from',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRequestDto.prototype, "issueFromStoreId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Updated delivery instructions',
        description: 'Additional comments',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRequestDto.prototype, "comments", void 0);
class PatchRequestLineDto {
    quantity;
    static _OPENAPI_METADATA_FACTORY() {
        return { quantity: { required: true, type: () => Number } };
    }
}
exports.PatchRequestLineDto = PatchRequestLineDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 15,
        description: 'Updated quantity for the line item',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], PatchRequestLineDto.prototype, "quantity", void 0);
class UpdateRequestLinesDto {
    lines;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { lines: { required: true, type: () => [require("./request.dto").RequestLineDto] }, reason: { required: false, type: () => String } };
    }
}
exports.UpdateRequestLinesDto = UpdateRequestLinesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => RequestLineDto,
        isArray: true,
        description: 'Updated request lines',
        example: [
            { itemId: '123e4567-e89b-12d3-a456-426614174001', quantity: 15 },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RequestLineDto),
    __metadata("design:type", Array)
], UpdateRequestLinesDto.prototype, "lines", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Quantity adjusted based on stock availability',
        description: 'Reason for updating lines',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRequestLinesDto.prototype, "reason", void 0);
class ReassignRequestDto {
    newUserId;
    newLocationId;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { newUserId: { required: true, type: () => String }, newLocationId: { required: false, type: () => String }, reason: { required: false, type: () => String } };
    }
}
exports.ReassignRequestDto = ReassignRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174004',
        description: 'User ID to reassign the request to',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReassignRequestDto.prototype, "newUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '123e4567-e89b-12d3-a456-426614174005',
        description: 'Optional new location for the request',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReassignRequestDto.prototype, "newLocationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Original assignee is on leave',
        description: 'Reason for reassignment',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReassignRequestDto.prototype, "reason", void 0);
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["DRAFT"] = "DRAFT";
    RequestStatus["SUBMITTED"] = "SUBMITTED";
    RequestStatus["IN_REVIEW"] = "IN_REVIEW";
    RequestStatus["IN_APPROVAL"] = "IN_APPROVAL";
    RequestStatus["APPROVED"] = "APPROVED";
    RequestStatus["REJECTED"] = "REJECTED";
    RequestStatus["FULFILLED"] = "FULFILLED";
    RequestStatus["CANCELLED"] = "CANCELLED";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
//# sourceMappingURL=request.dto.js.map