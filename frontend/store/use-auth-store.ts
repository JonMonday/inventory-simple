import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    fullName: string;
    roles?: string[];
}

interface AuthState {
    token: string | null;
    user: User | null;
    permissions: string[];
    _hasHydrated: boolean;
    login: (token: string, user: User, permissions: string[]) => void;
    logout: () => void;
    setPermissions: (permissions: string[]) => void;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            permissions: [],
            _hasHydrated: false,
            login: (token, user, permissions) => set({ token, user, permissions }),
            logout: () => {
                set({ token: null, user: null, permissions: [] });
                // Also clear storage to be safe
                localStorage.removeItem('auth-storage');
            },
            setPermissions: (permissions) => set({ permissions }),
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: (state) => {
                return () => state?.setHasHydrated(true);
            }
        }
    )
);
