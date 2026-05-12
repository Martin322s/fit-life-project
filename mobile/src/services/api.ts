import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from '../config/app.config';

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
  const url = `${AppConfig.apiUrl}${path}`;
  const token = await getToken();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AppConfig.apiTimeout);

  let res: Response;
  try {
    res = await fetch(url, {
      ...opts,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...((opts.headers as Record<string, string>) ?? {}),
      },
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Заявката отне твърде дълго. Провери интернет връзката.');
    }
    throw new Error('Мрежова грешка. Провери интернет връзката.');
  }

  clearTimeout(timeoutId);

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? 'Грешка при заявката.');
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
