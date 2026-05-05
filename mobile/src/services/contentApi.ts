import { request } from './api';

// ─── Shared pagination shape ──────────────────────────────────────────────────

export type Page<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// ─── Recipes ──────────────────────────────────────────────────────────────────

export type ApiRecipe = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string | null;
  prepMinutes: number | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  ingredients: string[] | null;
  instructions: string[] | null;
  imageUrl: string | null;
  createdAt: string;
};

export type RecipesQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  difficulty?: string;
};

export const recipesApi = {
  list: (q: RecipesQuery = {}) => {
    const params = new URLSearchParams();
    if (q.page) params.set('page', String(q.page));
    if (q.limit) params.set('limit', String(q.limit));
    if (q.search) params.set('search', q.search);
    if (q.category) params.set('category', q.category);
    if (q.difficulty) params.set('difficulty', q.difficulty);
    const qs = params.toString();
    return request<Page<ApiRecipe>>(`/api/recipes${qs ? `?${qs}` : ''}`);
  },

  get: (id: string) => request<{ item: ApiRecipe }>(`/api/recipes/${id}`),
};

// ─── Diets ────────────────────────────────────────────────────────────────────

export type ApiDiet = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  goalType: string | null;
  difficulty: string | null;
  durationDays: number | null;
  caloriesPerDay: number | null;
  proteinTarget: number | null;
  carbsTarget: number | null;
  fatTarget: number | null;
  rules: string[] | null;
  sampleMenu: string[] | null;
  suitableFor: string[] | null;
  notSuitableFor: string[] | null;
  imageUrl: string | null;
  createdAt: string;
};

export type DietsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  goalType?: string;
  difficulty?: string;
};

export const dietsApi = {
  list: (q: DietsQuery = {}) => {
    const params = new URLSearchParams();
    if (q.page) params.set('page', String(q.page));
    if (q.limit) params.set('limit', String(q.limit));
    if (q.search) params.set('search', q.search);
    if (q.category) params.set('category', q.category);
    if (q.goalType) params.set('goalType', q.goalType);
    if (q.difficulty) params.set('difficulty', q.difficulty);
    const qs = params.toString();
    return request<Page<ApiDiet>>(`/api/diets${qs ? `?${qs}` : ''}`);
  },

  get: (id: string) => request<{ item: ApiDiet }>(`/api/diets/${id}`),
};

// ─── Training Plans ───────────────────────────────────────────────────────────

export type ApiTrainingPlan = {
  id: string;
  title: string;
  description: string | null;
  goalType: string | null;
  level: string | null;
  durationWeeks: number | null;
  sessionsPerWeek: number | null;
  averageSessionMinutes: number | null;
  equipment: string[] | null;
  targetMuscles: string[] | null;
  caloriesBurnEstimate: number | null;
  planStructure: string[] | null;
  weeklySchedule: string[] | null;
  safetyNotes: string[] | null;
  imageUrl: string | null;
  createdAt: string;
};

export type TrainingPlansQuery = {
  page?: number;
  limit?: number;
  search?: string;
  goalType?: string;
  level?: string;
  equipment?: string;
};

export const trainingPlansApi = {
  list: (q: TrainingPlansQuery = {}) => {
    const params = new URLSearchParams();
    if (q.page) params.set('page', String(q.page));
    if (q.limit) params.set('limit', String(q.limit));
    if (q.search) params.set('search', q.search);
    if (q.goalType) params.set('goalType', q.goalType);
    if (q.level) params.set('level', q.level);
    if (q.equipment) params.set('equipment', q.equipment);
    const qs = params.toString();
    return request<Page<ApiTrainingPlan>>(`/api/training-plans${qs ? `?${qs}` : ''}`);
  },

  get: (id: string) => request<{ item: ApiTrainingPlan }>(`/api/training-plans/${id}`),
};

// ─── Products ─────────────────────────────────────────────────────────────────

export type ApiProduct = {
  id: string;
  name: string;
  description: string | null;
  brand: string | null;
  category: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  sugar: number | null;
  fiber: number | null;
  servingSize: number | null;
  servingUnit: string | null;
  barcode: string | null;
  imageUrl: string | null;
  tags: string[] | null;
  createdAt: string;
};

export type ProductsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minProtein?: number;
  maxCalories?: number;
  maxCarbs?: number;
};

export const productsApi = {
  list: (q: ProductsQuery = {}) => {
    const params = new URLSearchParams();
    if (q.page) params.set('page', String(q.page));
    if (q.limit) params.set('limit', String(q.limit));
    if (q.search) params.set('search', q.search);
    if (q.category) params.set('category', q.category);
    if (q.minProtein != null) params.set('minProtein', String(q.minProtein));
    if (q.maxCalories != null) params.set('maxCalories', String(q.maxCalories));
    if (q.maxCarbs != null) params.set('maxCarbs', String(q.maxCarbs));
    const qs = params.toString();
    return request<Page<ApiProduct>>(`/api/products${qs ? `?${qs}` : ''}`);
  },

  get: (id: string) => request<{ item: ApiProduct }>(`/api/products/${id}`),
};

// ─── Challenges ───────────────────────────────────────────────────────────────

export type ApiChallenge = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string | null;
  targetType: string | null;
  targetValue: number | null;
  targetUnit: string | null;
  durationDays: number | null;
  reward: string | null;
  imageUrl: string | null;
  createdAt: string;
};

export type ApiUserChallenge = {
  id: string;
  userId: string;
  challengeId: string;
  progressValue: number;
  status: 'active' | 'completed' | 'abandoned';
  startedAt: string;
  completedAt: string | null;
  challenge: ApiChallenge;
};

export type ChallengesQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  difficulty?: string;
};

export const challengesApi = {
  list: (q: ChallengesQuery = {}) => {
    const params = new URLSearchParams();
    if (q.page) params.set('page', String(q.page));
    if (q.limit) params.set('limit', String(q.limit));
    if (q.search) params.set('search', q.search);
    if (q.category) params.set('category', q.category);
    if (q.difficulty) params.set('difficulty', q.difficulty);
    const qs = params.toString();
    return request<Page<ApiChallenge>>(`/api/challenges${qs ? `?${qs}` : ''}`);
  },

  get: (id: string) => request<{ item: ApiChallenge }>(`/api/challenges/${id}`),
};

export const userChallengesApi = {
  list: () => request<{ items: ApiUserChallenge[] }>('/api/user-challenges'),

  join: (challengeId: string) =>
    request<{ item: ApiUserChallenge }>('/api/user-challenges', {
      method: 'POST',
      body: JSON.stringify({ challengeId }),
    }),

  update: (id: string, data: { progressValue?: number; status?: 'active' | 'completed' | 'abandoned' }) =>
    request<{ item: ApiUserChallenge }>(`/api/user-challenges/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  abandon: (id: string) =>
    request<void>(`/api/user-challenges/${id}`, { method: 'DELETE' }),
};

// ─── Workouts ─────────────────────────────────────────────────────────────────

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

export type CreateWorkoutInput = {
  title: string;
  type: string;
  durationMinutes: number;
  caloriesBurned?: number;
  notes?: string;
};

export const workoutsApi = {
  list: () => request<{ items: ApiWorkout[] }>('/api/workouts'),

  create: (data: CreateWorkoutInput) =>
    request<{ item: ApiWorkout }>('/api/workouts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<void>(`/api/workouts/${id}`, { method: 'DELETE' }),
};
