import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { authApi, type AuthUser, type RegisterInput } from '../services/authApi';
import { clearToken, getToken, setToken } from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ devResetUrl?: string }>;
  resetPassword: (token: string, password: string) => Promise<void>;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore session from stored token
  useEffect(() => {
    let cancelled = false;
    getToken()
      .then(async (token) => {
        if (!token || cancelled) return;
        const { user: u } = await authApi.me();
        if (!cancelled) setUser(u);
      })
      .catch(() => clearToken())
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: u, token } = await authApi.login(email, password);
    await setToken(token);
    setUser(u);
  }, []);

  const register = useCallback(async (data: RegisterInput) => {
    const { user: u, token } = await authApi.register(data);
    await setToken(token);
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    authApi.logout().catch(() => {});
    await clearToken();
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const res = await authApi.forgotPassword(email);
    return { devResetUrl: res.devResetUrl };
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    await authApi.resetPassword(token, password);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getInitials(user: AuthUser): string {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}

export function getDisplayName(user: AuthUser): string {
  return `${user.firstName} ${user.lastName}`;
}
