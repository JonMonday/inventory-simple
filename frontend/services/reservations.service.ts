import api from '@/lib/api';

export const ReservationsService = {
    getGlobal: async (params?: any) => {
        const { data } = await api.get('/reservations', { params });
        return data;
    }
};
