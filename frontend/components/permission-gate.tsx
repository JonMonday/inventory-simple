"use client";

import React from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { hasAll, Permission } from '@/permissions/matrix';

interface PermissionGateProps {
    children: React.ReactNode;
    permissions: Permission[];
    fallback?: React.ReactNode;
}

export function PermissionGate({ children, permissions, fallback = null }: PermissionGateProps) {
    const userPermissions = useAuthStore((state) => state.permissions);

    // If no permissions required, allow.
    if (!permissions || permissions.length === 0) {
        return <>{children}</>;
    }

    const hasAccess = hasAll(userPermissions, permissions);

    if (!hasAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
