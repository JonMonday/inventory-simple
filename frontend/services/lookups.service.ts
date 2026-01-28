import api from '@/lib/api';

export const LookupsService = {
    getRegistry: async () => {
        const { data } = await api.get('/lookups');
        return data;
    },

    getTable: async (name: string) => {
        const { data } = await api.get(`/lookups/${name}`);
        return data;
    },

    upsert: async (name: string, dto: any) => {
        if (dto.id) {
            return api.patch(`/lookups/${name}/${dto.id}`, dto);
        }
        return api.post(`/lookups/${name}`, dto);
    },

    activate: async (name: string, id: string) => {
        return api.post(`/lookups/${name}/${id}/activate`);
    },

    deactivate: async (name: string, id: string) => {
        return api.post(`/lookups/${name}/${id}/deactivate`);
    }
};
