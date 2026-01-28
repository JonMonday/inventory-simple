import { useState, useEffect } from 'react';
import { RequestsService, RequestHeader, RequestLine, RequestEvent, RequestAssignment, RequestParticipant, Reservation } from '@/services/requests.service';

export interface RequestAggregate {
    header: RequestHeader | null;
    lines: RequestLine[] | null;
    events: RequestEvent[] | null;
    comments: any[] | null;
    assignments: RequestAssignment[] | null;
    participants: RequestParticipant[] | null;
    reservations: Reservation[] | null;
}

export interface TabLoadingState {
    header: boolean;
    lines: boolean;
    events: boolean;
    comments: boolean;
    assignments: boolean;
    participants: boolean;
    reservations: boolean;
}

export interface TabErrorState {
    header: string | null;
    lines: string | null;
    events: string | null;
    comments: string | null;
    assignments: string | null;
    participants: string | null;
    reservations: string | null;
}

export function useRequestAggregate(id: string) {
    const [data, setData] = useState<RequestAggregate>({
        header: null,
        lines: null,
        events: null,
        comments: null,
        assignments: null,
        participants: null,
        reservations: null
    });

    const [loading, setLoading] = useState<TabLoadingState>({
        header: true,
        lines: false,
        events: false,
        comments: false,
        assignments: false,
        participants: false,
        reservations: false
    });

    const [errors, setErrors] = useState<TabErrorState>({
        header: null,
        lines: null,
        events: null,
        comments: null,
        assignments: null,
        participants: null,
        reservations: null
    });

    // Fetch header immediately
    useEffect(() => {
        const fetchHeader = async () => {
            try {
                setLoading(prev => ({ ...prev, header: true }));
                const header = await RequestsService.getById(id);
                setData(prev => ({ ...prev, header }));
                setErrors(prev => ({ ...prev, header: null }));
            } catch (error: any) {
                setErrors(prev => ({ ...prev, header: error.message || 'Failed to load request' }));
            } finally {
                setLoading(prev => ({ ...prev, header: false }));
            }
        };
        fetchHeader();
    }, [id]);

    // Lazy load functions for each tab
    const loadLines = async () => {
        if (data.lines !== null) return; // Already loaded
        try {
            setLoading(prev => ({ ...prev, lines: true }));
            const lines = await RequestsService.getLines(id);
            setData(prev => ({ ...prev, lines }));
            setErrors(prev => ({ ...prev, lines: null }));
        } catch (error: any) {
            setErrors(prev => ({ ...prev, lines: error.message || 'Failed to load lines' }));
        } finally {
            setLoading(prev => ({ ...prev, lines: false }));
        }
    };

    const loadEvents = async () => {
        if (data.events !== null) return;
        try {
            setLoading(prev => ({ ...prev, events: true }));
            const events = await RequestsService.getEvents(id);
            setData(prev => ({ ...prev, events }));
            setErrors(prev => ({ ...prev, events: null }));
        } catch (error: any) {
            setErrors(prev => ({ ...prev, events: error.message || 'Failed to load events' }));
        } finally {
            setLoading(prev => ({ ...prev, events: false }));
        }
    };

    const loadComments = async () => {
        if (data.comments !== null) return;
        try {
            setLoading(prev => ({ ...prev, comments: true }));
            const comments = await RequestsService.getComments(id);
            setData(prev => ({ ...prev, comments }));
            setErrors(prev => ({ ...prev, comments: null }));
        } catch (error: any) {
            setErrors(prev => ({ ...prev, comments: error.message || 'Failed to load comments' }));
        } finally {
            setLoading(prev => ({ ...prev, comments: false }));
        }
    };

    const loadAssignments = async () => {
        if (data.assignments !== null) return;
        try {
            setLoading(prev => ({ ...prev, assignments: true }));
            const assignments = await RequestsService.getAssignments(id);
            setData(prev => ({ ...prev, assignments }));
            setErrors(prev => ({ ...prev, assignments: null }));
        } catch (error: any) {
            setErrors(prev => ({ ...prev, assignments: error.message || 'Failed to load assignments' }));
        } finally {
            setLoading(prev => ({ ...prev, assignments: false }));
        }
    };

    const loadParticipants = async () => {
        if (data.participants !== null) return;
        try {
            setLoading(prev => ({ ...prev, participants: true }));
            const participants = await RequestsService.getParticipants(id);
            setData(prev => ({ ...prev, participants }));
            setErrors(prev => ({ ...prev, participants: null }));
        } catch (error: any) {
            setErrors(prev => ({ ...prev, participants: error.message || 'Failed to load participants' }));
        } finally {
            setLoading(prev => ({ ...prev, participants: false }));
        }
    };

    const loadReservations = async () => {
        if (data.reservations !== null) return;
        try {
            setLoading(prev => ({ ...prev, reservations: true }));
            const reservations = await RequestsService.getReservations(id);
            setData(prev => ({ ...prev, reservations }));
            setErrors(prev => ({ ...prev, reservations: null }));
        } catch (error: any) {
            setErrors(prev => ({ ...prev, reservations: error.message || 'Failed to load reservations' }));
        } finally {
            setLoading(prev => ({ ...prev, reservations: false }));
        }
    };

    const retry = (tab: keyof RequestAggregate) => {
        switch (tab) {
            case 'header':
                setData(prev => ({ ...prev, header: null }));
                setErrors(prev => ({ ...prev, header: null }));
                break;
            case 'lines':
                setData(prev => ({ ...prev, lines: null }));
                loadLines();
                break;
            case 'events':
                setData(prev => ({ ...prev, events: null }));
                loadEvents();
                break;
            case 'comments':
                setData(prev => ({ ...prev, comments: null }));
                loadComments();
                break;
            case 'assignments':
                setData(prev => ({ ...prev, assignments: null }));
                loadAssignments();
                break;
            case 'participants':
                setData(prev => ({ ...prev, participants: null }));
                loadParticipants();
                break;
            case 'reservations':
                setData(prev => ({ ...prev, reservations: null }));
                loadReservations();
                break;
        }
    };

    return {
        data,
        loading,
        errors,
        loadLines,
        loadEvents,
        loadComments,
        loadAssignments,
        loadParticipants,
        loadReservations,
        retry
    };
}
