import api from '@/lib/api';

export interface LedgerEntry {
    id: string;
    itemId: string;
    fromStoreLocationId?: string;
    toStoreLocationId?: string;
    movementTypeId: string;
    quantity: number;
    reasonCodeId: string;
    referenceNo?: string;
    createdAtUtc: string;
    reasonCode: { name: string };
    item: { name: string; code: string; unitOfMeasure: string };
    movementType: { label: string };
    fromStore?: { name: string };
    toStore?: { name: string };
    reversalOfLedgerId?: string;
    reversals?: { id: string }[];
}

export const LedgerService = {
    list: async () => {
        const { data } = await api.get<LedgerEntry[]>('/ledger');
        return data;
    },

    reverse: async (id: string, reason: string) => {
        return api.post(`/ledger/${id}/reverse`, { reason });
    }
};

export const InventoryService = {
    getSnapshots: async () => {
        const { data } = await api.get('/inventory/stock-snapshots');
        return data;
    },

    getSnapshot: async (itemId: string, storeLocationId: string) => {
        const { data } = await api.get(`/inventory/stock-snapshots/${itemId}/${storeLocationId}`);
        return data;
    },

    receive: async (payload: any) => api.post('/inventory/receive', payload),
    return: async (payload: any) => api.post('/inventory/return', payload),
    transfer: async (payload: any) => api.post('/inventory/transfer', payload),
    adjust: async (payload: any) => api.post('/inventory/adjust', payload),

    getReasonCodes: async () => {
        const { data } = await api.get('/inventory/reason-codes');
        return data;
    },

    getLocations: async () => {
        const { data } = await api.get('/inventory/locations');
        return data;
    },

    checkAvailability: async (payload: { itemId: string; storeLocationId: string; quantity: number }) => {
        const { data } = await api.post('/inventory/availability', payload);
        return data;
    },

    getItemStock: async (itemId: string) => {
        const { data } = await api.get(`/items/${itemId}/stock`);
        return data;
    }
};
