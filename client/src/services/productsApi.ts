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

export type ProductCategory = "meat" | "fish" | "eggs" | "dairy" | "grains" | "bread" | "pasta" | "rice" | "legumes" | "vegetables" | "fruits" | "nuts" | "seeds" | "oils" | "sweets" | "snacks" | "drinks" | "sauces" | "ready meals" | "supplements";

export type ApiProduct = {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  brand: string | null;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number | null;
  fiber: number | null;
  salt: number | null;
  barcode: string | null;
  imageUrl: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = Omit<ApiProduct, "id" | "createdAt" | "updatedAt">;

export type ProductsPage = {
  items: ApiProduct[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProductsQuery = {
  page: number;
  limit: number;
  search?: string;
  category?: ProductCategory | "";
  minProtein?: number;
  maxCalories?: number;
  maxCarbs?: number;
};

function queryString(query: ProductsQuery): string {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.minProtein !== undefined) params.set("minProtein", String(query.minProtein));
  if (query.maxCalories !== undefined) params.set("maxCalories", String(query.maxCalories));
  if (query.maxCarbs !== undefined) params.set("maxCarbs", String(query.maxCarbs));
  return params.toString();
}

export const productsApi = {
  list: (query: ProductsQuery) => api<ProductsPage>(`/api/products?${queryString(query)}`),
  get: (id: string) => api<{ item: ApiProduct }>(`/api/products/${id}`),
  create: (data: ProductInput) => api<{ item: ApiProduct }>("/api/products", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<ProductInput>) => api<{ item: ApiProduct }>(`/api/products/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => api<void>(`/api/products/${id}`, { method: "DELETE" }),
};
