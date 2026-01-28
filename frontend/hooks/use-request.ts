import { useState, useEffect, useCallback } from 'react';
import { RequestsService, RequestHeader, RequestLine, RequestEvent, RequestAssignment, RequestParticipant, Reservation } from '@/services/requests.service';
import { toast } from 'sonner';

export interface AggregateRequest extends RequestHeader {
    lines: RequestLine[];
    events: RequestEvent[];
    assignments: RequestAssignment[];
    participants: RequestParticipant[];
    reservations: Reservation[];
    comments: any[];
}

export const useRequest = (id: string) => {
    const [request, setRequest] = useState<AggregateRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadRequest = useCallback(async () => {
        try {
            setLoading(true);
            const [header, lines, events, assignments, participants, reservations, comments] = await Promise.all([
                RequestsService.getById(id),
                RequestsService.getLines(id),
                RequestsService.getEvents(id),
                RequestsService.getAssignments(id),
                RequestsService.getParticipants(id),
                RequestsService.getReservations(id),
                RequestsService.getComments(id)
            ]);

            setRequest({
                ...header,
                lines,
                events,
                assignments,
                participants,
                reservations,
                comments
            });
            setError(null);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to fetch request details';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) loadRequest();
    }, [id, loadRequest]);

    return {
        request,
        loading,
        error,
        refresh: loadRequest
    };
};
