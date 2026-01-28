import api from '@/lib/api';

export const StocktakesService = {
    list: async (params?: any) => {
        const { data } = await api.get('/stocktakes', { params });
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/stocktakes/${id}`);
        return data;
    },

    create: async (dto: any) => {
        const { data } = await api.post('/stocktakes', dto);
        return data;
    },

    // Lifecycle actions
    startCount: async (id: string) => {
        return api.post(`/stocktakes/${id}/start-count`);
    },

    submitCount: async (id: string, results: any) => {
        return api.post(`/stocktakes/${id}/submit-count`, results);
    },

    approve: async (id: string) => {
        return api.post(`/stocktakes/${id}/approve`);
    },

    apply: async (id: string) => {
        return api.post(`/stocktakes/${id}/apply`);
    },

    // Subresources
    getLines: async (id: string) => {
        const { data } = await api.get(`/stocktakes/${id}/lines`);
        return data;
    }
};
