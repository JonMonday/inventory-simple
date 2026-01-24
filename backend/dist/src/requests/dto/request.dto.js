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
exports.RequestStatus = exports.ReassignRequestDto = exports.UpdateRequestLinesDto = exports.CreateRequestDto = exports.RequestLineDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class RequestLineDto {
    itemId;
    quantity;
}
exports.RequestLineDto = RequestLineDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RequestLineDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], RequestLineDto.prototype, "quantity", void 0);
class CreateRequestDto {
    lines;
    comments;
}
exports.CreateRequestDto = CreateRequestDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RequestLineDto),
    __metadata("design:type", Array)
], CreateRequestDto.prototype, "lines", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRequestDto.prototype, "comments", void 0);
class UpdateRequestLinesDto {
    lines;
    reason;
}
exports.UpdateRequestLinesDto = UpdateRequestLinesDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RequestLineDto),
    __metadata("design:type", Array)
], UpdateRequestLinesDto.prototype, "lines", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRequestLinesDto.prototype, "reason", void 0);
class ReassignRequestDto {
    newUserId;
    newLocationId;
    reason;
}
exports.ReassignRequestDto = ReassignRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReassignRequestDto.prototype, "newUserId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReassignRequestDto.prototype, "newLocationId", void 0);
__decorate([
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