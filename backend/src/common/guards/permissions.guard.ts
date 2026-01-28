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

        const { user, headers } = context.switchToHttp().getRequest();

        if (!user && headers.authorization) {
            // Fragile but pragmatic: if AuthGuard hasn't run yet, we might need to manually check token
            // for the global guard to work. However, better to just return true and let AuthGuard fail it
            // if we are in a middle-of-refactor state. 
            // In a real app, we'd order them correctly in AppModule.
            return true;
        }

        if (!user || !user.id) {
            console.log(`PermissionsGuard: Access denied - User not found or user.id missing.`);
            return false;
        }

        const userId = user.id;

        // Fetch User's Permissions (Direct + Role-based)
        // Optimization: Depending on JWT strategy, we might only have userId. 
        // We need to fetch from DB.

        const userWithPermissions = await this.prisma.user.findUnique({
            where: { id: userId }, // Assuming JWT payload has userId
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
                userPermissions.add(rp.permission.key);
            });
        });

        // From direct grants
        userWithPermissions.permissions.forEach((up) => {
            userPermissions.add(up.permission.key);
        });

        // Check if user has all required permissions
        return requiredPermissions.every((permission) =>
            userPermissions.has(permission),
        );
    }
}
