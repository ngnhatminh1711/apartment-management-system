import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { UserInfo, LoginRequest, AuthResponse } from "../types/auth";
import type { UserRole } from "../types/common";
import { storage } from "../utils/storage";
import { authService } from "../services/authService";

interface AuthContextValue {
    user: UserInfo | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (req: LoginRequest) => Promise<AuthResponse>;
    logout: () => void;
    hasRole: (role: UserRole) => boolean;
    hasAnyRole: (roles: UserRole[]) => boolean;
    updateUser: (user: UserInfo) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isLoading, setLoading] = useState(true);

    // Khôi phục session từ localStorage khi load trang
    useEffect(() => {
        const savedUser = storage.getUser();
        const savedToken = storage.getToken();
        if (savedUser && savedToken) {
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (req: LoginRequest): Promise<AuthResponse> => {
        const res = await authService.login(req);
        storage.setToken(res.accessToken);
        storage.setRefreshToken(res.refreshToken);
        storage.setUser(res.user);
        setUser(res.user);
        return res;
    }, []);

    const logout = useCallback(() => {
        storage.clear();
        setUser(null);
        window.location.href = "/login";
    }, []);

    const hasRole = useCallback((role: UserRole) => user?.roles.includes(role) ?? false, [user]);

    const hasAnyRole = useCallback(
        (roles: UserRole[]) => roles.some((r) => user?.roles.includes(r)) ?? false,
        [user],
    );

    const updateUser = useCallback((updated: UserInfo) => {
        setUser(updated);
        storage.setUser(updated);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
                hasRole,
                hasAnyRole,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
