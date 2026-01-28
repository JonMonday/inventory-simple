import api from '@/lib/api';

export const RBACService = {
    // Users
    getUsers: async (params?: any) => {
        const { data } = await api.get('/users', { params });
        return data;
    },

    getUser: async (id: string) => {
        const { data } = await api.get(`/users/${id}`);
        return data;
    },

    createUser: async (dto: any) => {
        const { data } = await api.post('/users', dto);
        return data;
    },

    updateUser: async (id: string, dto: any) => {
        const { data } = await api.patch(`/users/${id}`, dto);
        return data;
    },

    // User-Role mapping
    assignUserRole: async (userId: string, roleId: string) => {
        return api.post(`/users/${userId}/roles`, { roleId });
    },

    removeUserRole: async (userId: string, roleId: string) => {
        return api.delete(`/users/${userId}/roles/${roleId}`);
    },

    // Roles
    getRoles: async (params?: any) => {
        const { data } = await api.get('/roles', { params });
        return data;
    },

    getRole: async (id: string) => {
        const { data } = await api.get(`/roles/${id}`);
        return data;
    },

    createRole: async (dto: any) => {
        const { data } = await api.post('/roles', dto);
        return data;
    },

    updateRole: async (id: string, dto: any) => {
        const { data } = await api.patch(`/roles/${id}`, dto);
        return data;
    },

    // Role-Permission mapping
    addRolePermission: async (roleId: string, permissionId: string) => {
        return api.post(`/roles/${roleId}/permissions`, { permissionId });
    },

    removeRolePermission: async (roleId: string, permissionId: string) => {
        return api.delete(`/roles/${roleId}/permissions/${permissionId}`);
    },

    // Permissions
    getPermissions: async (params?: any) => {
        const { data } = await api.get('/admin/permissions', { params });
        return data;
    }
};
