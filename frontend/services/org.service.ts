import api from '@/lib/api';

// Generic CRUD + activate/deactivate for organizational entities
const createEntityService = (endpoint: string) => ({
    list: async (params?: any) => {
        const { data } = await api.get(`/${endpoint}`, { params });
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/${endpoint}/${id}`);
        return data;
    },

    create: async (dto: any) => {
        const { data } = await api.post(`/${endpoint}`, dto);
        return data;
    },

    update: async (id: string, dto: any) => {
        const { data } = await api.patch(`/${endpoint}/${id}`, dto);
        return data;
    },

    activate: async (id: string) => {
        return api.post(`/${endpoint}/${id}/activate`);
    },

    deactivate: async (id: string) => {
        return api.post(`/${endpoint}/${id}/deactivate`);
    }
});

export const OrgService = {
    branches: createEntityService('branches'),
    departments: createEntityService('departments'),
    units: createEntityService('units'),
    jobRoles: createEntityService('job-roles'),
    storeLocations: createEntityService('store-locations'),
    categories: createEntityService('categories'),
    reasonCodes: createEntityService('reason-codes')
};
