import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class LookupRegistryGuard implements CanActivate {
    private readonly allowlist;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
