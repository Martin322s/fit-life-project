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

export type RecipeCategory = "breakfast" | "lunch" | "dinner" | "snack" | "high-protein" | "low-calorie" | "vegetarian";
export type RecipeDifficulty = "easy" | "medium" | "hard";

export type ApiRecipe = {
  id: string;
  title: string;
  description: string;
  category: RecipeCategory;
  imageUrl: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepMinutes: number;
  difficulty: RecipeDifficulty;
  ingredients: string[];
  instructions: string[];
  createdAt: string;
  updatedAt: string;
};

export type RecipeInput = {
  title: string;
  description: string;
  category: RecipeCategory;
  imageUrl?: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepMinutes: number;
  difficulty: RecipeDifficulty;
  ingredients: string[];
  instructions: string[];
};

export type RecipesPage = {
  items: ApiRecipe[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type RecipesQuery = {
  page: number;
  limit: number;
  search?: string;
  category?: RecipeCategory | "";
  difficulty?: RecipeDifficulty | "";
};

function queryString(query: RecipesQuery): string {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.difficulty) params.set("difficulty", query.difficulty);
  return params.toString();
}

export const recipesApi = {
  list: (query: RecipesQuery) => api<RecipesPage>(`/api/recipes?${queryString(query)}`),
  get: (id: string) => api<{ item: ApiRecipe }>(`/api/recipes/${id}`),
  create: (data: RecipeInput) => api<{ item: ApiRecipe }>("/api/recipes", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<RecipeInput>) => api<{ item: ApiRecipe }>(`/api/recipes/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => api<void>(`/api/recipes/${id}`, { method: "DELETE" }),
};
