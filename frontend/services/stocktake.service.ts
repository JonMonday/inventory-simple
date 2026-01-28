import api from '@/lib/api';

export interface StocktakeHeader {
    id: string;
    readableId: string;
    storeLocationId: string;
    statusId: string;
    initiatedAt: string;
    status: { code: string; label: string };
    storeLocation: { name: string };
}

export const StocktakeService = {
    list: async () => {
        const { data } = await api.get<StocktakeHeader[]>('/stocktakes');
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get<StocktakeHeader>(`/stocktakes/${id}`);
        return data;
    },

    getLines: async (id: string) => {
        const { data } = await api.get(`/stocktakes/${id}/lines`);
        return data;
    },

    create: async (storeLocationId: string) => {
        return api.post('/stocktakes', { storeLocationId });
    },

    startCount: async (id: string) => api.post(`/stocktakes/${id}/start-count`),

    saveCounts: async (id: string, lines: { id: string; countedQuantity: number }[]) =>
        api.post(`/stocktakes/${id}/save-counts`, { lines }),

    completeCount: async (id: string) => api.post(`/stocktakes/${id}/complete-count`),

    approve: async (id: string) => api.post(`/stocktakes/${id}/approve`),

    apply: async (id: string) => api.post(`/stocktakes/${id}/apply`),

    cancel: async (id: string) => api.post(`/stocktakes/${id}/cancel`),
};
