import api from '@/lib/api';

export interface RequestLine {
    id: string;
    itemId: string;
    quantity: number;
    item: { code: string; name: string; unitOfMeasure: string };
}

export interface RequestEvent {
    id: string;
    eventTypeId: string;
    actedByUserId: string;
    metadata?: string;
    createdAt: string;
    eventType: { label: string };
    actedBy?: { fullName: string };
}

export interface RequestAssignment {
    id: string;
    assignedToId?: string;
    assignmentType: 'POOL' | 'USER';
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    assignedAt: string;
    assignedTo?: { fullName: string; email: string };
    assignedRoleKey?: string;
}

export interface RequestParticipant {
    userId: string;
    participantRoleTypeId: string;
    user: { fullName: string };
    roleType: { label: string };
}

export interface Reservation {
    id: string;
    itemId: string;
    quantity: number;
    storeLocationId: string;
    item: { name: string };
}

export interface RequestHeader {
    id: string;
    readableId: string;
    requesterUserId: string;
    statusId: string;
    currentStageTypeId: string;
    createdAt: string;
    status: { code: string; label: string };
    currentStageType?: { code: string; label: string };
    requester: { fullName: string; email?: string; department?: { name: string } };
    department?: { name: string };
}

export const RequestsService = {
    // Navigation & Lists
    list: async () => {
        const { data } = await api.get('/requests');
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get<RequestHeader>(`/requests/${id}`);
        return data;
    },

    listAssignedToMe: async (params?: any) => {
        const { data } = await api.get('/requests', { params: { ...params, assignedToMe: true } });
        return data;
    },

    create: async (dto: any) => {
        const { data } = await api.post('/requests', dto);
        return data;
    },

    update: async (id: string, dto: any) => {
        const { data } = await api.put(`/requests/${id}`, dto);
        return data;
    },

    clone: async (id: string) => {
        const { data } = await api.post(`/requests/${id}/clone`);
        return data;
    },

    // Sub-resources
    getLines: async (id: string) => {
        const { data } = await api.get<RequestLine[]>(`/requests/${id}/lines`);
        return data;
    },

    getEvents: async (id: string) => {
        const { data } = await api.get<RequestEvent[]>(`/requests/${id}/events`);
        return data;
    },

    getAssignments: async (id: string) => {
        const { data } = await api.get<RequestAssignment[]>(`/requests/${id}/assignments`);
        return data;
    },

    getParticipants: async (id: string) => {
        const { data } = await api.get<RequestParticipant[]>(`/requests/${id}/participants`);
        return data;
    },

    getReservations: async (id: string) => {
        const { data } = await api.get<Reservation[]>(`/requests/${id}/reservations`);
        return data;
    },

    getComments: async (id: string) => {
        const { data } = await api.get(`/requests/${id}/comments`);
        return data;
    },

    // Actions
    submit: async (id: string) => api.post(`/requests/${id}/submit`),
    approve: async (id: string) => api.post(`/requests/${id}/approve`),
    reject: async (id: string, reason: string) => api.post(`/requests/${id}/reject`, { reason }),
    cancel: async (id: string) => api.post(`/requests/${id}/cancel`),
    confirm: async (id: string) => api.post(`/requests/${id}/confirm`),
    reassign: async (id: string, userId: string) => api.post(`/requests/${id}/reassign`, { userId }),

    // Fulfillment Actions
    reserve: async (id: string) => api.post(`/requests/${id}/fulfillment/reserve`),
    issue: async (id: string) => api.post(`/requests/${id}/fulfillment/issue`),

    // Line Management (Guard protected)
    addLine: async (id: string, itemId: string, quantity: number) =>
        api.post(`/requests/${id}/lines`, { itemId, quantity }),

    updateLine: async (id: string, lineId: string, quantity: number) =>
        api.patch(`/requests/${id}/lines/${lineId}`, { quantity }),

    removeLine: async (id: string, lineId: string) =>
        api.post(`/requests/${id}/lines/${lineId}/remove`),

    // Comments
    addComment: async (id: string, body: string) =>
        api.post(`/requests/${id}/comments`, { body }),

    // Reviewer Resolution
    getEligibleReviewers: async (id: string) => {
        const { data } = await api.get(`/requests/${id}/reviewers`);
        return data;
    },

    createAssignments: async (id: string, stageId: string, userIds: string[]) => {
        const { data } = await api.post(`/requests/${id}/assignments`, { stageId, userIds });
        return data;
    }
};
