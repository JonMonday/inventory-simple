import { useAuthStore } from '@/store/use-auth-store';
import { AuthService } from '@/services/auth.service';

export const useAuth = () => {
    const { user, token, logout: storeLogout, _hasHydrated } = useAuthStore();

    const logout = () => {
        AuthService.logout();
    };

    return {
        user,
        token,
        isAuthenticated: !!token,
        isLoaded: _hasHydrated,
        logout
    };
};
