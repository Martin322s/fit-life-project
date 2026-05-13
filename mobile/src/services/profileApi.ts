import { request, getToken } from './api';
import { AppConfig } from '../config/app.config';

export type ProfileGender = 'male' | 'female';
export type ProfileActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very';
export type ProfileGoalType = 'lose_weight' | 'maintain' | 'gain_weight';

export type ApiProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: ProfileGender | null;
  age: number | null;
  heightCm: number | null;
  currentWeight: number | null;
  goalWeight: number | null;
  activityLevel: ProfileActivityLevel | null;
  goalType: ProfileGoalType | null;
  caloriesTarget: number | null;
  proteinTarget: number | null;
  carbsTarget: number | null;
  fatTarget: number | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  gender?: ProfileGender | null;
  age?: number | null;
  heightCm?: number | null;
  goalWeight?: number | null;
  activityLevel?: ProfileActivityLevel | null;
  goalType?: ProfileGoalType | null;
  caloriesTarget?: number | null;
  proteinTarget?: number | null;
  carbsTarget?: number | null;
  fatTarget?: number | null;
};

export const profileApi = {
  get: () => request<{ profile: ApiProfile }>('/api/profile'),

  update: (patch: UpdateProfileInput) =>
    request<{ profile: ApiProfile }>('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),

  // Upload a profile image from a local URI (from expo-image-picker).
  // Does NOT set Content-Type so React Native can set it with the multipart boundary.
  uploadAvatar: async (uri: string, mimeType = 'image/jpeg'): Promise<{ profile: ApiProfile }> => {
    const token = await getToken();
    const extMap: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
    const ext = extMap[mimeType] ?? 'jpg';

    const formData = new FormData();
    // React Native FormData accepts a plain object for file parts.
    formData.append('image', { uri, type: mimeType, name: `avatar.${ext}` } as unknown as Blob);

    const res = await fetch(`${AppConfig.apiUrl}/api/profile/avatar`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(body.message ?? 'Грешка при качване на аватар.');
    }
    return res.json() as Promise<{ profile: ApiProfile }>;
  },

  deleteAvatar: () =>
    request<{ profile: ApiProfile }>('/api/profile/avatar', { method: 'DELETE' }),
};
