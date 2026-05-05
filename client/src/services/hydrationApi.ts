const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

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
      ...((options.headers as Record<string, string>) ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? "Грешка при заявката.");
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type ApiHydrationEntry = {
  id: string;
  userId: string;
  amountMl: number;
  createdAt: string;
  updatedAt: string;
};

export const hydrationApi = {
  getToday(): Promise<{ items: ApiHydrationEntry[]; totalMl: number }> {
    return request("/api/hydration");
  },

  add(amountMl: number): Promise<{ item: ApiHydrationEntry }> {
    return request("/api/hydration", {
      method: "POST",
      body: JSON.stringify({ amountMl }),
    });
  },

  remove(id: string): Promise<void> {
    return request(`/api/hydration/${id}`, { method: "DELETE" });
  },
};
