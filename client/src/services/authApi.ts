// All requests go to /api/* — Vite proxies them to the Next.js server in dev.
// In production set VITE_API_URL to the deployed server origin.
const BASE = import.meta.env.VITE_API_URL ?? "";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
};

type AuthResponse = { user: AuthUser; token: string };

function getToken(): string | null {
  return localStorage.getItem("fitlife-token") ?? sessionStorage.getItem("fitlife-token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? "Грешка при заявката.");
  }

  return res.json() as Promise<T>;
}

export type LoginInput = { email: string; password: string };

export type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender?: "male" | "female" | "";
  age?: string;
  heightUnit?: "cm" | "ft";
  height?: string;
  weightUnit?: "kg" | "lb";
  weight?: string;
  goal?: "lose" | "maintain" | "gain" | "";
  activity?: "sedentary" | "light" | "moderate" | "very" | "";
};

export const authApi = {
  login(input: LoginInput) {
    return request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  register(input: RegisterInput) {
    return request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  logout() {
    return request<{ message: string }>("/api/auth/logout", { method: "POST" });
  },

  me() {
    return request<{ user: AuthUser }>("/api/auth/me");
  },

  forgotPassword(email: string) {
    return request<{ message: string; devResetUrl?: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword(token: string, password: string) {
    return request<{ message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  },
};
