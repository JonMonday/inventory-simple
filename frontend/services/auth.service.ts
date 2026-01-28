import api from '@/lib/api';
import { useAuthStore } from '@/store/use-auth-store';

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        fullName: string;
        roles?: { role: { code: string; permissions: { permission: { resource: string; action: string } }[] } }[];
    }
}

export const AuthService = {
    login: async (email: string, passwordHash: string) => {
        const { data } = await api.post<LoginResponse>('/auth/login', { email, passwordHash });

        // Flatten permissions: "resource.action"
        const perms: string[] = [];
        if (data.user.roles) {
            data.user.roles.forEach(ur => {
                ur.role.permissions.forEach(rp => {
                    perms.push(`${rp.permission.resource}.${rp.permission.action}`);
                });
            });
        }

        useAuthStore.getState().login(
            data.token,
            { id: data.user.id, email: data.user.email, fullName: data.user.fullName },
            Array.from(new Set(perms))
        );

        return data;
    },

    logout: () => {
        useAuthStore.getState().logout();
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
        await api.post('/auth/change-password', { currentPassword, newPassword });
    }
};
