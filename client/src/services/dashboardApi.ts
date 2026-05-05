const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

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
      ...(opts.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "Грешка при заявката.");
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type ApiMeal = {
  id: string;
  userId: string;
  title: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiProgressEntry = {
  id: string;
  userId: string;
  weightKg: number;
  waistCm: number | null;
  notes: string | null;
  createdAt: string;
};

export type ApiGoal = {
  id: string;
  userId: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: "active" | "completed" | "abandoned";
  createdAt: string;
  updatedAt: string;
};

export type ApiWorkout = {
  id: string;
  userId: string;
  title: string;
  type: string;
  durationMinutes: number;
  caloriesBurned: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export const dashboardApi = {
  getMeals:    () => api<{ items: ApiMeal[] }>("/api/meals"),
  getProgress: () => api<{ items: ApiProgressEntry[] }>("/api/progress"),
  getGoals:    () => api<{ items: ApiGoal[] }>("/api/goals"),
  getWorkouts: () => api<{ items: ApiWorkout[] }>("/api/workouts"),

  logWeight: (
    dataOrWeight: number | { weightKg: number; waistCm?: number; notes?: string },
    notes?: string,
  ) => {
    const data =
      typeof dataOrWeight === "number"
        ? { weightKg: dataOrWeight, ...(notes ? { notes } : {}) }
        : dataOrWeight;
    return api<{ item: ApiProgressEntry }>("/api/progress", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  deleteProgress: (id: string) =>
    api<void>(`/api/progress/${id}`, { method: "DELETE" }),

  logProgress: (data: { weightKg: number; waistCm?: number; notes?: string }) =>
    api<{ item: ApiProgressEntry }>("/api/progress", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logMeal: (data: {
    title: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    notes?: string;
  }) =>
    api<{ item: ApiMeal }>("/api/meals", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateMeal: (
    id: string,
    data: {
      title?: string;
      calories?: number;
      protein?: number | null;
      carbs?: number | null;
      fat?: number | null;
      notes?: string | null;
    },
  ) =>
    api<{ item: ApiMeal }>(`/api/meals/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteMeal: (id: string) =>
    api<void>(`/api/meals/${id}`, { method: "DELETE" }),
};
