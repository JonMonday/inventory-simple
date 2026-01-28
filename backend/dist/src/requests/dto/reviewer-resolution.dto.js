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
exports.RequestAssignmentDto = exports.CreateAssignmentsDto = exports.ReviewerResolutionResponseDto = exports.EligibleReviewerDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class EligibleReviewerDto {
    id;
    fullName;
    email;
    departmentName;
    unitName;
    branchName;
    roleCodes;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, fullName: { required: true, type: () => String }, email: { required: true, type: () => String }, departmentName: { required: false, type: () => String }, unitName: { required: false, type: () => String }, branchName: { required: false, type: () => String }, roleCodes: { required: true, type: () => [String] } };
    }
}
exports.EligibleReviewerDto = EligibleReviewerDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EligibleReviewerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EligibleReviewerDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EligibleReviewerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], EligibleReviewerDto.prototype, "departmentName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], EligibleReviewerDto.prototype, "unitName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], EligibleReviewerDto.prototype, "branchName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], EligibleReviewerDto.prototype, "roleCodes", void 0);
class ReviewerResolutionResponseDto {
    stageId;
    assignmentMode;
    roleKey;
    eligibleUsers;
    constraints;
    static _OPENAPI_METADATA_FACTORY() {
        return { stageId: { required: true, type: () => String }, assignmentMode: { required: true, type: () => Object }, roleKey: { required: true, type: () => String }, eligibleUsers: { required: true, type: () => [require("./reviewer-resolution.dto").EligibleReviewerDto] }, constraints: { required: true, type: () => Object } };
    }
}
exports.ReviewerResolutionResponseDto = ReviewerResolutionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReviewerResolutionResponseDto.prototype, "stageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AssignmentMode }),
    __metadata("design:type", String)
], ReviewerResolutionResponseDto.prototype, "assignmentMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReviewerResolutionResponseDto.prototype, "roleKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [EligibleReviewerDto] }),
    __metadata("design:type", Array)
], ReviewerResolutionResponseDto.prototype, "eligibleUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ReviewerResolutionResponseDto.prototype, "constraints", void 0);
class CreateAssignmentsDto {
    stageId;
    userIds;
    static _OPENAPI_METADATA_FACTORY() {
        return { stageId: { required: true, type: () => String, format: "uuid" }, userIds: { required: true, type: () => [String], format: "uuid" } };
    }
}
exports.CreateAssignmentsDto = CreateAssignmentsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAssignmentsDto.prototype, "stageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    __metadata("design:type", Array)
], CreateAssignmentsDto.prototype, "userIds", void 0);
class RequestAssignmentDto {
    id;
    assignmentType;
    status;
    assignedToId;
    assignedToName;
    assignedRoleKey;
    assignedAt;
    completedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, assignmentType: { required: true, type: () => Object }, status: { required: true, type: () => Object }, assignedToId: { required: false, type: () => String }, assignedToName: { required: false, type: () => String }, assignedRoleKey: { required: false, type: () => String }, assignedAt: { required: true, type: () => Date }, completedAt: { required: false, type: () => Date } };
    }
}
exports.RequestAssignmentDto = RequestAssignmentDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequestAssignmentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AssignmentType }),
    __metadata("design:type", String)
], RequestAssignmentDto.prototype, "assignmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AssignmentStatus }),
    __metadata("design:type", String)
], RequestAssignmentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], RequestAssignmentDto.prototype, "assignedToId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], RequestAssignmentDto.prototype, "assignedToName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], RequestAssignmentDto.prototype, "assignedRoleKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], RequestAssignmentDto.prototype, "assignedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], RequestAssignmentDto.prototype, "completedAt", void 0);
//# sourceMappingURL=reviewer-resolution.dto.js.map