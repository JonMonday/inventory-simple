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
exports.OwnershipGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OwnershipGuard = class OwnershipGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const requestId = request.params.id;
        const user = request.user;
        if (!user) {
            return false;
        }
        const isAdmin = user.roles?.some((role) => ['SuperAdmin', 'InventoryAdmin'].includes(role));
        if (isAdmin) {
            return true;
        }
        if (!requestId) {
            return true;
        }
        const dbRequest = await this.prisma.request.findUnique({
            where: { id: requestId },
            select: { requesterUserId: true },
        });
        if (!dbRequest) {
            throw new common_1.NotFoundException('Request not found');
        }
        if (dbRequest.requesterUserId !== user.id) {
            throw new common_1.ForbiddenException('You do not have permission to perform this action on this request');
        }
        return true;
    }
};
exports.OwnershipGuard = OwnershipGuard;
exports.OwnershipGuard = OwnershipGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OwnershipGuard);
//# sourceMappingURL=ownership.guard.js.map