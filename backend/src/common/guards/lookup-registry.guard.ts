import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * LookupRegistryGuard
 * Validates that the metadata table name requested exists in the hardcoded allowlist.
 */
@Injectable()
export class LookupRegistryGuard implements CanActivate {
    private readonly allowlist = [
        'request_statuses',
        'request_stage_types',
        'request_event_types',
        'comment_types',
        'participant_role_types',
        'ledger_movement_types',
        'stocktake_statuses',
        'item_statuses'
    ];

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const name = request.params.name;

        if (!name) {
            return true; // Root list route
        }

        if (!this.allowlist.includes(name)) {
            throw new ForbiddenException(`Invalid lookup table name: ${name}. Access restricted to system registry.`);
        }

        return true;
    }
}
