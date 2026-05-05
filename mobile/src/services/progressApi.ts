import { request } from './api';

export type ApiProgressEntry = {
  id: string;
  userId: string;
  weightKg: number | null;
  waistCm: number | null;
  notes: string | null;
  createdAt: string;
};

export const progressApi = {
  list: () => request<{ items: ApiProgressEntry[] }>('/api/progress'),

  create: (data: { weightKg?: number; waistCm?: number; notes?: string }) =>
    request<{ item: ApiProgressEntry }>('/api/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<void>(`/api/progress/${id}`, { method: 'DELETE' }),
};
