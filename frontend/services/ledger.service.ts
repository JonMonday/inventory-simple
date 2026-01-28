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
    list: async (params?: any) => {
        const { data } = await api.get<LedgerEntry[]>('/ledger', { params });
        return data;
    },

    getById: async (id: string) => {
        // Strategy: Try direct endpoint, fallback to list filter, then client-side find
        try {
            const { data } = await api.get<LedgerEntry>(`/ledger/${id}`);
            return data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                // Fallback: Filter from list
                const { data } = await api.get<LedgerEntry[]>('/ledger', { params: { ids: id } });
                if (data.length > 0) return data[0];

                // Last resort: Client-side find (dev-only fallback)
                const allData = await api.get<LedgerEntry[]>('/ledger');
                const entry = allData.data.find((e: LedgerEntry) => e.id === id);
                if (entry) return entry;
            }
            throw error;
        }
    },

    reverse: async (id: string, reason: string) => {
        return api.post(`/ledger/${id}/reverse`, { reason });
    }
};
