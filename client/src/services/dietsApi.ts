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

export type DietCategory = "balanced" | "high-protein" | "low-carb" | "calorie-deficit" | "vegetarian" | "muscle-gain" | "heart-healthy";
export type DietGoalType = "lose_weight" | "maintain_weight" | "gain_weight" | "health";
export type DietDifficulty = "easy" | "medium" | "hard";

export type ApiDiet = {
  id: string;
  title: string;
  description: string;
  category: DietCategory;
  goalType: DietGoalType;
  durationDays: number;
  difficulty: DietDifficulty;
  caloriesPerDay: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  rules: string[];
  sampleMenu: string[];
  suitableFor: string[];
  notSuitableFor: string[];
  createdAt: string;
  updatedAt: string;
};

export type DietInput = Omit<ApiDiet, "id" | "createdAt" | "updatedAt">;

export type DietsPage = {
  items: ApiDiet[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type DietsQuery = {
  page: number;
  limit: number;
  search?: string;
  category?: DietCategory | "";
  goalType?: DietGoalType | "";
  difficulty?: DietDifficulty | "";
};

function queryString(query: DietsQuery): string {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.goalType) params.set("goalType", query.goalType);
  if (query.difficulty) params.set("difficulty", query.difficulty);
  return params.toString();
}

export const dietsApi = {
  list: (query: DietsQuery) => api<DietsPage>(`/api/diets?${queryString(query)}`),
  get: (id: string) => api<{ item: ApiDiet }>(`/api/diets/${id}`),
  create: (data: DietInput) => api<{ item: ApiDiet }>("/api/diets", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<DietInput>) => api<{ item: ApiDiet }>(`/api/diets/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => api<void>(`/api/diets/${id}`, { method: "DELETE" }),
};
