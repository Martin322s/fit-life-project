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

export type TrainingGoalType = "lose_weight" | "muscle_gain" | "endurance" | "strength" | "mobility" | "general_fitness";
export type TrainingLevel = "beginner" | "intermediate" | "advanced";
export type TrainingEquipment = "none" | "dumbbells" | "gym" | "resistance bands" | "treadmill/bike";

export type ApiTrainingPlan = {
  id: string;
  title: string;
  description: string;
  goalType: TrainingGoalType;
  level: TrainingLevel;
  durationWeeks: number;
  sessionsPerWeek: number;
  averageSessionMinutes: number;
  equipment: TrainingEquipment[];
  targetMuscles: string[];
  caloriesBurnEstimate: number | null;
  planStructure: string[];
  weeklySchedule: string[];
  safetyNotes: string[];
  createdAt: string;
  updatedAt: string;
};

export type TrainingPlanInput = Omit<ApiTrainingPlan, "id" | "createdAt" | "updatedAt">;

export type TrainingPlansPage = {
  items: ApiTrainingPlan[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TrainingPlansQuery = {
  page: number;
  limit: number;
  search?: string;
  goalType?: TrainingGoalType | "";
  level?: TrainingLevel | "";
  equipment?: TrainingEquipment | "";
};

function queryString(query: TrainingPlansQuery): string {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);
  if (query.goalType) params.set("goalType", query.goalType);
  if (query.level) params.set("level", query.level);
  if (query.equipment) params.set("equipment", query.equipment);
  return params.toString();
}

export const trainingPlansApi = {
  list: (query: TrainingPlansQuery) => api<TrainingPlansPage>(`/api/training-plans?${queryString(query)}`),
  get: (id: string) => api<{ item: ApiTrainingPlan }>(`/api/training-plans/${id}`),
  create: (data: TrainingPlanInput) => api<{ item: ApiTrainingPlan }>("/api/training-plans", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<TrainingPlanInput>) => api<{ item: ApiTrainingPlan }>(`/api/training-plans/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => api<void>(`/api/training-plans/${id}`, { method: "DELETE" }),
};
