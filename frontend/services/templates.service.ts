import api from '@/lib/api';

export const TemplatesService = {
    list: async (params?: any) => {
        const { data } = await api.get('/templates', { params });
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/templates/${id}`);
        return data;
    },

    create: async (dto: any) => {
        const { data } = await api.post('/templates', dto);
        return data;
    },

    update: async (id: string, dto: any) => {
        const { data } = await api.patch(`/templates/${id}`, dto);
        return data;
    },

    activate: async (id: string) => {
        return api.post(`/templates/${id}/activate`);
    },

    deactivate: async (id: string) => {
        return api.post(`/templates/${id}/deactivate`);
    },

    setDefault: async (id: string) => {
        return api.post(`/templates/${id}/set-default`);
    },

    validate: async (id: string) => {
        return api.post(`/templates/${id}/validate`);
    }
};
