import { useAuthStore } from '@/store/use-auth-store';
import { hasAny, hasAll } from '@/permissions/matrix';

export const usePermissions = () => {
    const { permissions, user } = useAuthStore();

    const isSuperAdmin = user?.email === 'superadmin@gra.local' || permissions.includes('super_admin');

    const hasPermission = (perm: string): boolean => {
        if (isSuperAdmin) return true;
        return permissions.includes(perm);
    };

    const hasAnyPermissions = (perms: string[]): boolean => {
        return hasAny(permissions, perms);
    };

    const hasAllPermissions = (perms: string[]): boolean => {
        return hasAll(permissions, perms);
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
