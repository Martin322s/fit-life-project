import Constants from 'expo-constants';
import { Platform } from 'react-native';

// ─── Edit these two lines when the backend moves ──────────────────────────────

const PRODUCTION_API_URL = 'https://fit-life-api.netlify.app';
const LOCAL_API_PORT = 3001;

// ─── Environment ──────────────────────────────────────────────────────────────

export type AppEnv = 'production' | 'local';

function detectEnv(): AppEnv {
  return __DEV__ ? 'local' : 'production';
}

// ─── API URL resolver ─────────────────────────────────────────────────────────
//
// Resolution order (local / dev builds only):
//
//  1. EXPO_PUBLIC_API_BASE_URL env var — optional override for CI or staging.
//     Set it in eas.json env block or as an EAS secret to point a build at
//     a different backend without touching source code.
//
//  2. Metro dev-server host extracted from the Expo manifest.
//     When you run `npx expo start`, Expo embeds the bundler address in the
//     manifest it sends to the app (Constants.manifest2). We reuse that host
//     with the backend port. This makes it work automatically on:
//       - Android Emulator   → Metro reports localhost → remapped to 10.0.2.2
//       - iOS Simulator      → Metro reports localhost → used directly
//       - Physical device    → Metro reports your LAN IP → used directly
//     No manual IP setup, no .env file needed.
//
//  3. Hardcoded emulator fallbacks — last resort when the manifest is absent.
//
// Production builds (APK / AAB / App Store):
//   __DEV__ is false → PRODUCTION_API_URL is used unconditionally.
//   The resolver below is never called. No localhost can leak in.

function resolveApiUrl(): string {
  if (!__DEV__) return PRODUCTION_API_URL;

  // Optional override (CI, staging, custom backend)
  const override = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (override) return override;

  // Extract the Metro host from the live Expo manifest.
  //
  // Resolution order (SDK 54+):
  //   1. Constants.expoGoConfig.debuggerHost  — the documented SDK 54 API
  //   2. Constants.manifest2.extra.expoClient.hostUri  — older Expo Go API
  //   3. Constants.manifest.debuggerHost  — legacy; its getter throws in SDK 54
  //      when the embedded app.config is unavailable, so we wrap it in try/catch.
  let rawUri: string | undefined;
  try {
    rawUri =
      (Constants as any).expoGoConfig?.debuggerHost ??
      (Constants.manifest2 as any)?.extra?.expoClient?.hostUri ??
      (Constants as any).manifest?.debuggerHost ??
      undefined;
  } catch {
    // Constants.manifest throws ERR_CONSTANTS_MANIFEST_UNAVAILABLE in SDK 54
    // when the embedded app.config hasn't loaded yet — safe to ignore.
  }

  if (rawUri) {
    const host = rawUri.split(':')[0]; // strip the Metro port, keep the IP/hostname

    // Android emulator reports localhost/127.0.0.1 but needs the emulator
    // gateway (10.0.2.2) to reach the host machine's backend.
    if (Platform.OS === 'android' && (host === 'localhost' || host === '127.0.0.1')) {
      return `http://10.0.2.2:${LOCAL_API_PORT}`;
    }

    return `http://${host}:${LOCAL_API_PORT}`;
  }

  // Fallback: no manifest available (rare — e.g. bare RN without Metro running)
  return Platform.OS === 'android'
    ? `http://10.0.2.2:${LOCAL_API_PORT}`
    : `http://localhost:${LOCAL_API_PORT}`;
}

// ─── Exported config ──────────────────────────────────────────────────────────

export const AppConfig = {
  env: detectEnv(),
  apiUrl: resolveApiUrl(),
  apiTimeout: 15_000,
} as const;

// ─── Startup log (dev only) ───────────────────────────────────────────────────

if (__DEV__) {
  console.log('[FitLife] ──────────────────────────────────');
  console.log(`[FitLife] env:      ${AppConfig.env}`);
  console.log(`[FitLife] platform: ${Platform.OS}`);
  console.log(`[FitLife] api:      ${AppConfig.apiUrl}`);
  console.log('[FitLife] ──────────────────────────────────');
}
