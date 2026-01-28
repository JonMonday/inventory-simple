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
exports.CommonController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_1 = require("./auth/permissions");
class PermissionDto {
    permission;
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Object.values(permissions_1.PERMISSIONS) }),
    __metadata("design:type", String)
], PermissionDto.prototype, "permission", void 0);
let CommonController = class CommonController {
    getPermissions() {
        return Object.values(permissions_1.PERMISSIONS);
    }
};
exports.CommonController = CommonController;
__decorate([
    (0, common_1.Get)('permissions'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Returns all system permissions',
        type: [String],
        schema: {
            example: Object.values(permissions_1.PERMISSIONS)
        }
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "getPermissions", null);
exports.CommonController = CommonController = __decorate([
    (0, swagger_1.ApiTags)('Common'),
    (0, common_1.Controller)('common')
], CommonController);
//# sourceMappingURL=common.controller.js.map