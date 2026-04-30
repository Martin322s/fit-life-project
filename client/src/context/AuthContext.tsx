import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { JSX } from "react";
import { authApi, type AuthUser } from "../services/authApi";

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser, token: string, rememberMe?: boolean) => void;
  register: (user: AuthUser, token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string; devResetUrl?: string }>;
  resetPassword: (token: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "fitlife-token";
const AUTH_KEY = "fitlife-auth";

// Checks localStorage first, then sessionStorage.
// authApi.request() uses the same logic to attach the Bearer token.
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

function persistAuth(u: AuthUser, token: string, remember: boolean) {
  const store = remember ? localStorage : sessionStorage;
  // Always clear the other storage so there's never a stale token in both.
  const other = remember ? sessionStorage : localStorage;
  other.removeItem(TOKEN_KEY);
  other.removeItem(AUTH_KEY);

  store.setItem(TOKEN_KEY, token);
  store.setItem(
    AUTH_KEY,
    JSON.stringify({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
      loggedInAt: new Date().toISOString(),
    }),
  );
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(AUTH_KEY);
}

export function AuthProvider({ children }: { children: JSX.Element }): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: validate stored token via /me to restore session.
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then(({ user: u }) => setUser(u))
      .catch(() => clearAuth())
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback((u: AuthUser, token: string, rememberMe = false) => {
    persistAuth(u, token, rememberMe);
    setUser(u);
  }, []);

  // Register always persists to localStorage (equivalent to "remember me").
  const register = useCallback((u: AuthUser, token: string) => {
    persistAuth(u, token, true);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    authApi.logout().catch(() => {});
    clearAuth();
    setUser(null);
  }, []);

  const forgotPassword = useCallback((email: string) => {
    return authApi.forgotPassword(email);
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    await authApi.resetPassword(token, password);
  }, []);

  // Re-fetch /me and update state — call this if the user profile changes on the server.
  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;
    const store = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
    try {
      const { user: u } = await authApi.me();
      setUser(u);
      store.setItem(AUTH_KEY, JSON.stringify({ ...u, loggedInAt: new Date().toISOString() }));
    } catch {
      clearAuth();
      setUser(null);
    }
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
        refreshUser,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/** Derive "ИИ"-style initials from a user object. */
export function getInitials(user: AuthUser): string {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}
