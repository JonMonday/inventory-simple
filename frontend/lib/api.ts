import axios from 'axios';
import { useAuthStore } from '@/store/use-auth-store';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const data = error.response?.data;

        // 401 Unauthorized - Logout and redirect to login
        if (status === 401) {
            useAuthStore.getState().logout();
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            toast.error('Session expired. Please log in again.');
        }

        // 403 Forbidden - Permission denied
        if (status === 403) {
            const message = data?.message || 'You do not have permission to perform this action.';
            toast.error(`Permission Denied: ${message}`);
        }

        // 409 Conflict - Business logic validation errors
        if (status === 409) {
            const message = data?.message || 'A conflict occurred. Please review your input.';
            toast.warning(message);
        }

        // 422 Unprocessable Entity - Form validation errors
        if (status === 422) {
            const message = data?.message || 'Validation failed. Please check your input.';
            toast.error(message);

            // Attach validation errors for form handling
            if (data?.errors) {
                error.validationErrors = data.errors;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
