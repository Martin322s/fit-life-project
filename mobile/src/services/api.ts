import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from '../config/app.config';

// ─── Token helpers ────────────────────────────────────────────────────────────

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

// ─── Error classification ─────────────────────────────────────────────────────

type NetworkErrorKind = 'TIMEOUT' | 'SSL' | 'DNS' | 'NETWORK' | 'UNKNOWN';

function classifyFetchError(err: unknown): NetworkErrorKind {
  if (!(err instanceof Error)) return 'UNKNOWN';
  if (err.name === 'AbortError') return 'TIMEOUT';
  const msg = err.message.toLowerCase();
  if (msg.includes('ssl') || msg.includes('certificate') || msg.includes('tls')) return 'SSL';
  if (msg.includes('dns') || msg.includes('getaddrinfo') || msg.includes('unable to resolve'))
    return 'DNS';
  if (
    msg.includes('network') ||
    msg.includes('fetch') ||
    msg.includes('connection') ||
    msg.includes('failed to connect')
  )
    return 'NETWORK';
  return 'UNKNOWN';
}

const ERROR_MESSAGES: Record<NetworkErrorKind, string> = {
  TIMEOUT: 'Заявката отне твърде дълго. Провери интернет връзката.',
  SSL: 'SSL/TLS грешка. Провери сертификата на сървъра.',
  DNS: 'DNS грешка. Не може да се достигне сървъра.',
  NETWORK: 'Мрежова грешка. Провери интернет връзката.',
  UNKNOWN: 'Грешка при заявката. Провери интернет връзката.',
};

// ─── Core request ─────────────────────────────────────────────────────────────

export async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const url = `${AppConfig.apiUrl}${path}`;
  const method = opts.method ?? 'GET';
  const token = await getToken();

  if (__DEV__) {
    console.log(`[API →] ${method} ${url}`);
    console.log(`[API]   token: ${token ? 'present' : 'none'}`);
  }

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
    const kind = classifyFetchError(err);
    if (__DEV__) {
      console.error(`[API ✗] ${kind} — ${method} ${url}`, err);
    }
    throw new Error(ERROR_MESSAGES[kind]);
  }

  clearTimeout(timeoutId);

  if (__DEV__) {
    console.log(`[API ←] ${res.status} ${res.statusText}  ${method} ${url}`);
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    if (__DEV__) {
      console.warn(`[API ✗] HTTP ${res.status} — ${body.message ?? '(no message)'}`);
    }
    throw new Error(body.message ?? 'Грешка при заявката.');
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
