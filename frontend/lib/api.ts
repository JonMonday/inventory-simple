import axios from 'axios';
import { useAuthStore } from '@/store/use-auth-store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        // We can't use hooks here, so we access the store directly if using Zustand outside components
        // Or we rely on the component calling api to ensure token is set?
        // Better: Zustand store functions can be imported.
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
        if (error.response?.status === 401) {
            // Logic to logout or refresh token
            useAuthStore.getState().logout();
            // Optionally redirect to login if we can access router, or let the UI handle the state change
        }
        return Promise.reject(error);
    }
);

export default api;
