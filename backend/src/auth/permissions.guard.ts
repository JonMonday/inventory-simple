import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector, private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPermissions) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            return false;
        }

        // Fetch User's Permissions (Direct + Role-based)
        // Optimization: Depending on JWT strategy, we might only have userId. 
        // We need to fetch from DB.

        const userWithPermissions = await this.prisma.user.findUnique({
            where: { id: user.userId }, // Assuming JWT payload has userId
            include: {
                permissions: { include: { permission: true } },
                roles: {
                    include: {
                        role: {
                            include: {
                                permissions: { include: { permission: true } }
                            }
                        }
                    }
                }
            }
        });

        if (!userWithPermissions) return false;

        // Flatten permissions
        const userPerms = new Set<string>();

        // Direct
        userWithPermissions.permissions.forEach(p => userPerms.add(`${p.permission.resource}.${p.permission.action}`));

        // Role-based
        userWithPermissions.roles.forEach(ur => {
            ur.role.permissions.forEach(rp => {
                userPerms.add(`${rp.permission.resource}.${rp.permission.action}`);
            });
        });

        // Check
        const hasPermission = requiredPermissions.every((permission) => userPerms.has(permission));

        if (!hasPermission) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }
}
