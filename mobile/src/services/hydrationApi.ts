import { request } from './api';

export type ApiHydrationEntry = {
  id: string;
  userId: string;
  amountMl: number;
  createdAt: string;
  updatedAt: string;
};

export const hydrationApi = {
  getToday: () => request<{ items: ApiHydrationEntry[]; totalMl: number }>('/api/hydration'),
  add: (amountMl: number) =>
    request<{ item: ApiHydrationEntry }>('/api/hydration', {
      method: 'POST',
      body: JSON.stringify({ amountMl }),
    }),
  remove: (id: string) => request<void>(`/api/hydration/${id}`, { method: 'DELETE' }),
};
