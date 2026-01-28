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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const password_utils_1 = require("../common/utils/password.utils");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
                department: true,
                unit: true,
                branch: true,
            },
        });
        if (process.env.NODE_ENV !== 'production') {
            if (!user) {
                console.log(`[AUTH DEBUG] User not found: ${email}`);
            }
            else if (!user.isActive) {
                console.log(`[AUTH DEBUG] User inactive: ${email}`);
            }
        }
        if (!user || !user.isActive) {
            return null;
        }
        const isPasswordValid = await (0, password_utils_1.verifyPassword)(password, user.passwordHash);
        if (process.env.NODE_ENV !== 'production' && !isPasswordValid) {
            console.log(`[AUTH DEBUG] Password mismatch for: ${email}`);
        }
        if (!isPasswordValid) {
            return null;
        }
        const { passwordHash, ...result } = user;
        return result;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                department: user.department,
                mustChangePassword: user.mustChangePassword,
                roles: user.roles.map((ur) => ur.role.name),
            },
        };
    }
    async changePassword(userId, newPassword) {
        const passwordHash = await (0, password_utils_1.hashPassword)(newPassword);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash,
                mustChangePassword: false,
            }
        });
        return { message: 'Password updated successfully' };
    }
    async findPermissions(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                permissions: {
                    include: {
                        permission: true,
                    },
                },
                roles: {
                    include: {
                        role: {
                            include: {
                                permissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            return [];
        }
        const permissionSet = new Set();
        user.permissions.forEach((up) => {
            permissionSet.add(up.permission.key);
        });
        user.roles.forEach((ur) => {
            ur.role.permissions.forEach((rp) => {
                permissionSet.add(rp.permission.key);
            });
        });
        return Array.from(permissionSet);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map