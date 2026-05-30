import Constants from "expo-constants";

// The mobile app calls the unified Next.js app (client/) which serves both
// the web UI and /api/* REST routes from a single deployment.
//
// Dev: Expo debugger host (LAN IP of your machine), port 3000
// Prod: NEXT_PUBLIC_API_BASE_URL from client/.env, or the default Netlify URL

const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];

const isDev = __DEV__;

export const AppConfig = {
  apiUrl:
    isDev && debuggerHost
      ? `http://${debuggerHost}:3000`
      : (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://fitlife-com.netlify.app"),
  apiTimeout: 35000,
} as const;
