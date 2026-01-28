import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * OwnershipGuard
 * Actor must be the original Requester of the request.
 * Admin (SuperAdmin or InventoryAdmin) can override for ALL routes.
 */
@Injectable()
export class OwnershipGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const requestId = request.params.id;
        const user = request.user;

        if (!user) {
            return false;
        }

        // 1. Admin Override Check
        const isAdmin = user.roles?.some((role: string) =>
            ['SuperAdmin', 'InventoryAdmin'].includes(role)
        );
        if (isAdmin) {
            return true;
        }

        if (!requestId) {
            return true; // No ID in params, skip
        }

        // 2. Requester Check
        const dbRequest = await this.prisma.request.findUnique({
            where: { id: requestId },
            select: { requesterUserId: true },
        });

        if (!dbRequest) {
            throw new NotFoundException('Request not found');
        }

        if (dbRequest.requesterUserId !== user.id) {
            throw new ForbiddenException('You do not have permission to perform this action on this request');
        }

        return true;
    }
}
