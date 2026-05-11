import { API_BASE_URL as BASE } from "./apiConfig";

function token(): string | null {
  return localStorage.getItem("fitlife-token") ?? sessionStorage.getItem("fitlife-token");
}

async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const t = token();
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...((opts.headers as Record<string, string>) ?? {}),
    },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "Грешка при заявката.");
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type AdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  createdAt: string;
};

export type AdminStats = {
  users: { total: number; new30d: number };
  meals: number;
  progressEntries: number;
  workouts: number;
  goals: number;
  content: {
    recipes: number;
    diets: number;
    trainingPlans: number;
    products: number;
    challenges: number;
    userChallenges: number;
  };
};

export const adminApi = {
  getUsers: (): Promise<{ items: AdminUser[] }> => api("/api/admin/users"),
  getStats: (): Promise<AdminStats> => api("/api/admin/stats"),
  patchUserRole: (id: string, role: "user" | "admin"): Promise<{ item: { id: string; role: string } }> =>
    api(`/api/admin/users/${id}`, { method: "PATCH", body: JSON.stringify({ role }) }),
  deleteUser: (id: string): Promise<void> =>
    api(`/api/admin/users/${id}`, { method: "DELETE" }),
};
