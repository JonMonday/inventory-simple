import api from '@/lib/api';

// Generic CRUD + activate/deactivate for catalog entities
const createCatalogService = (endpoint: string, activateEndpoint?: string) => ({
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
        const { data } = await api.put(`/${endpoint}/${id}`, dto);
        return data;
    },

    activate: async (id: string) => {
        const endpoint = activateEndpoint || 'activate';
        return api.post(`/${endpoint}/${id}/${endpoint}`);
    },

    deactivate: async (id: string) => {
        return api.post(`/${endpoint}/${id}/deactivate`);
    }
});

export const CatalogService = {
    items: {
        ...createCatalogService('items'),
        // Items use 'activate' not 'reactivate'
        activate: async (id: string) => api.post(`/items/${id}/activate`),
        deactivate: async (id: string) => api.post(`/items/${id}/deactivate`)
    },
    categories: createCatalogService('categories'),
    reasonCodes: createCatalogService('reason-codes')
};
