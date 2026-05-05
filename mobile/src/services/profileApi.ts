import { request } from './api';

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
};
