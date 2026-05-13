import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { authApi, type AuthUser, type RegisterInput } from '../services/authApi';
import { clearToken, getToken, setToken } from '../services/api';
import { profileApi, type ApiProfile } from '../services/profileApi';

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthContextType = {
  user: AuthUser | null;
  /** Full profile including avatarUrl. Loaded after auth; null while loading. */
  profile: ApiProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ devResetUrl?: string }>;
  resetPassword: (token: string, password: string) => Promise<void>;
  /** Directly overwrite the cached profile (e.g. after avatar upload). */
  setProfile: (p: ApiProfile | null) => void;
  /** Re-fetch the profile from the API and update context. */
  refreshProfile: () => Promise<void>;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile silently — a missing profile is not fatal.
  const fetchProfile = useCallback(async (cancelled?: { current: boolean }) => {
    try {
      const { profile: p } = await profileApi.get();
      if (!cancelled?.current) setProfile(p);
    } catch {
      // New user may not have a profile record yet.
    }
  }, []);

  // On mount: restore session from stored token
  useEffect(() => {
    const guard = { current: false };
    getToken()
      .then(async (token) => {
        if (!token || guard.current) return;
        const { user: u } = await authApi.me();
        if (!guard.current) {
          setUser(u);
          fetchProfile(guard);
        }
      })
      .catch(() => clearToken())
      .finally(() => {
        if (!guard.current) setIsLoading(false);
      });
    return () => {
      guard.current = true;
    };
  }, [fetchProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const { user: u, token } = await authApi.login(email, password);
    await setToken(token);
    setUser(u);
    fetchProfile();
  }, [fetchProfile]);

  const register = useCallback(async (data: RegisterInput) => {
    const { user: u, token } = await authApi.register(data);
    await setToken(token);
    setUser(u);
    fetchProfile();
  }, [fetchProfile]);

  const logout = useCallback(async () => {
    authApi.logout().catch(() => {});
    await clearToken();
    setUser(null);
    setProfile(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    const res = await authApi.forgotPassword(email);
    return { devResetUrl: res.devResetUrl };
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    await authApi.resetPassword(token, password);
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: user !== null,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        setProfile,
        refreshProfile,
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
