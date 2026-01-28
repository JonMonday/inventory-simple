import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * EditableStateGuard
 * Rejects mutation if the request status is NOT marked as isEditable.
 * Applies to: PUT /requests/:id, lines mutations.
 */
@Injectable()
export class EditableStateGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requestId = request.params.id;

    if (!requestId) {
      return true; // No ID in params, skip (might be a create route where ID is not yet present)
    }

    const dbRequest = await this.prisma.request.findUnique({
      where: { id: requestId },
      include: { status: true },
    });

    if (!dbRequest) {
      throw new NotFoundException('Request not found');
    }

    if (!dbRequest.status.isEditable) {
      throw new ForbiddenException(
        `Request cannot be modified in its current status: ${dbRequest.status.label}`,
      );
    }

    return true;
  }
}
