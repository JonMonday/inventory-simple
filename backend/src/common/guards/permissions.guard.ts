import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            return false;
        }

        // Get user's permissions from roles and direct grants
        const userWithPermissions = await this.prisma.user.findUnique({
            where: { id: user.userId },
            include: {
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
                permissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });

        if (!userWithPermissions) {
            return false;
        }

        // Collect all permissions
        const userPermissions = new Set<string>();

        // From roles
        userWithPermissions.roles.forEach((ur) => {
            ur.role.permissions.forEach((rp) => {
                userPermissions.add(`${rp.permission.resource}.${rp.permission.action}`);
            });
        });

        // From direct grants
        userWithPermissions.permissions.forEach((up) => {
            userPermissions.add(`${up.permission.resource}.${up.permission.action}`);
        });

        // Check if user has all required permissions
        return requiredPermissions.every((permission) =>
            userPermissions.has(permission),
        );
    }
}
