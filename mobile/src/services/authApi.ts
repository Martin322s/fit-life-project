import { request } from './api';

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
};

type AuthResponse = { user: AuthUser; token: string };

export type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender?: 'male' | 'female';
  age?: number;
  height?: number;
  heightUnit?: 'cm' | 'ft';
  weight?: number;
  weightUnit?: 'kg' | 'lb';
  goal?: 'lose' | 'maintain' | 'gain';
  activity?: 'sedentary' | 'light' | 'moderate' | 'very';
};

export const authApi = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: RegisterInput) =>
    request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => request<{ user: AuthUser }>('/api/auth/me'),

  logout: () =>
    request<{ message: string }>('/api/auth/logout', { method: 'POST' }),

  forgotPassword: (email: string) =>
    request<{ message: string; devResetUrl?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};
