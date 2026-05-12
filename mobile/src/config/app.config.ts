import Constants from "expo-constants";

const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];

const isDev = __DEV__;

export const AppConfig = {
  apiUrl:
    isDev && debuggerHost
      ? `http://${debuggerHost}:3001`
      : "https://fit-life-api.netlify.app",
  apiTimeout: 35000,
} as const;
