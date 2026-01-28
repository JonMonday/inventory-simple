import api from '@/lib/api';

export const AdminService = {
    // Org Structure
    getBranches: () => api.get('/org/branches').then(r => r.data),
    getDepartments: () => api.get('/org/departments').then(r => r.data),
    getUnits: () => api.get('/org/units').then(r => r.data),
    getJobRoles: () => api.get('/org/job-roles').then(r => r.data),
    getStoreLocations: () => api.get('/org/store-locations').then(r => r.data),

    // RBAC
    getRoles: () => api.get('/roles').then(r => r.data),
    createRole: (data: any) => api.post('/roles', data).then(r => r.data),
    updateRole: (id: string, data: any) => api.patch(`/roles/${id}`, data).then(r => r.data),
    getRolePermissions: (roleId: string) => api.get(`/roles/${roleId}/permissions`).then(r => r.data),
    addRolePermission: (roleId: string, permissionId: string) => api.post(`/roles/${roleId}/permissions`, { permissionId }),
    removeRolePermission: (roleId: string, permissionId: string) => api.post(`/roles/${roleId}/permissions/${permissionId}/remove`),
    getPermissions: () => api.get('/permissions').then(r => r.data),
    getUsers: () => api.get('/users').then(r => r.data),

    // Templates
    getTemplates: () => api.get('/templates').then(r => r.data),
    getTemplate: (id: string) => api.get(`/templates/${id}`).then(r => r.data),
    updateTemplate: (id: string, data: any) => api.put(`/templates/${id}`, data),
    saveTemplateSteps: (id: string, steps: any[]) => api.post(`/templates/${id}/steps`, { steps }),
};

export const LookupsService = {
    getRegistry: () => api.get('/lookups').then(r => r.data),
    updateLookup: (resource: string, id: string, data: any) => api.put(`/lookups/${resource}/${id}`, data),
    createLookup: (resource: string, data: any) => api.post(`/lookups/${resource}`, data),
};
