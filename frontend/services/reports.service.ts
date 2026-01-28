import api from '@/lib/api';

export const ReportsService = {
    getMovements: async (params?: any) => {
        const { data } = await api.get('/reports/movements', { params });
        return data;
    },

    getAdjustmentsSummary: async (params?: any) => {
        const { data } = await api.get('/reports/adjustments-summary', { params });
        return data;
    },

    getStockSnapshots: async (params?: any) => {
        const { data } = await api.get('/reports/stock-snapshots', { params });
        return data;
    },

    getStock: async (params?: any) => {
        const { data } = await api.get('/reports/stock-on-hand', { params });
        return data;
    },

    getLowStock: async (params?: any) => {
        const { data } = await api.get('/reports/low-stock', { params });
        return data;
    },

    getKPIs: async (params?: any) => {
        const { data } = await api.get('/reports/request-kpis', { params });
        return data;
    }
};
