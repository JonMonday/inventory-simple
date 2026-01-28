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
exports.ConfirmRequestDto = exports.ReassignRequestDto = exports.CancelRequestDto = exports.RejectRequestDto = exports.ApproveRequestDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ApproveRequestDto {
    comment;
    static _OPENAPI_METADATA_FACTORY() {
        return { comment: { required: false, type: () => String } };
    }
}
exports.ApproveRequestDto = ApproveRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Approved - all items in stock',
        description: 'Optional approval comment',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ApproveRequestDto.prototype, "comment", void 0);
class RejectRequestDto {
    comment;
    static _OPENAPI_METADATA_FACTORY() {
        return { comment: { required: true, type: () => String } };
    }
}
exports.RejectRequestDto = RejectRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Items not available - rejected',
        description: 'Required rejection reason',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RejectRequestDto.prototype, "comment", void 0);
class CancelRequestDto {
    comment;
    static _OPENAPI_METADATA_FACTORY() {
        return { comment: { required: false, type: () => String } };
    }
}
exports.CancelRequestDto = CancelRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'No longer needed',
        description: 'Optional cancellation reason',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CancelRequestDto.prototype, "comment", void 0);
class ReassignRequestDto {
    targetUserId;
    static _OPENAPI_METADATA_FACTORY() {
        return { targetUserId: { required: true, type: () => String } };
    }
}
exports.ReassignRequestDto = ReassignRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123e4567-e89b-12d3-a456-426614174010',
        description: 'User ID to reassign to',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReassignRequestDto.prototype, "targetUserId", void 0);
class ConfirmRequestDto {
    comment;
    static _OPENAPI_METADATA_FACTORY() {
        return { comment: { required: false, type: () => String } };
    }
}
exports.ConfirmRequestDto = ConfirmRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Items received in good condition',
        description: 'Optional confirmation comment',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ConfirmRequestDto.prototype, "comment", void 0);
//# sourceMappingURL=request-actions.dto.js.map