import { useAuthStore } from '@/store/use-auth-store';
import { hasAny, hasAll, Permission } from '@/permissions/matrix';

export const usePermissions = () => {
    const { permissions, user } = useAuthStore();

    const isSuperAdmin = user?.email === 'superadmin@gra.local' || permissions.includes('super_admin');

    const hasPermission = (perm: string): boolean => {
        if (isSuperAdmin) return true;
        return permissions.includes(perm);
    };

    const hasAnyPermissions = (perms: string[]): boolean => {
        return hasAny(permissions as Permission[], perms as Permission[]);
    };

    const hasAllPermissions = (perms: string[]): boolean => {
        return hasAll(permissions as Permission[], perms as Permission[]);
    };

    return {
        permissions,
        user,
        isSuperAdmin,
        hasPermission,
        hasAnyPermissions,
        hasAllPermissions
    };
};
