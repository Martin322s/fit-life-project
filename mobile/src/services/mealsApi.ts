import { request } from './api';

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

export type CreateMealInput = {
  title: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string;
};

export type UpdateMealInput = {
  title?: string;
  calories?: number;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  notes?: string | null;
};

export const mealsApi = {
  list: () => request<{ items: ApiMeal[] }>('/api/meals'),

  create: (data: CreateMealInput) =>
    request<{ item: ApiMeal }>('/api/meals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateMealInput) =>
    request<{ item: ApiMeal }>(`/api/meals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<void>(`/api/meals/${id}`, { method: 'DELETE' }),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

export function sumCalories(meals: ApiMeal[]): number {
  return meals.reduce((sum, m) => sum + m.calories, 0);
}

export function sumMacros(meals: ApiMeal[]): { protein: number; carbs: number; fat: number } {
  return meals.reduce(
    (acc, m) => ({
      protein: acc.protein + (m.protein ?? 0),
      carbs: acc.carbs + (m.carbs ?? 0),
      fat: acc.fat + (m.fat ?? 0),
    }),
    { protein: 0, carbs: 0, fat: 0 },
  );
}
