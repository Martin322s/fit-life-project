import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

declare const process: { env?: { EXPO_PUBLIC_API_BASE_URL?: string } };

const configuredApiBaseUrl =
  process.env?.EXPO_PUBLIC_API_BASE_URL ??
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined);

// TODO: move token persistence to Expo SecureStore before publishing.
// Local development defaults:
// Android emulator -> http://10.0.2.2:3000
// iOS simulator    -> http://localhost:3000
// Physical device  -> set EXPO_PUBLIC_API_BASE_URL=http://YOUR_LAN_IP:3000
// Production       -> set EXPO_PUBLIC_API_BASE_URL to deployed SERVER_URL
export const API_BASE_URL: string =
  configuredApiBaseUrl ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000');
export const TOKEN_KEY = 'fitlife-token';

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  return AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  return AsyncStorage.removeItem(TOKEN_KEY);
}

export async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((opts.headers as Record<string, string>) ?? {}),
    },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? 'Грешка при заявката.');
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
