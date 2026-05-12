import Constants from "expo-constants";

const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];

export const AppConfig = {
  apiUrl: `http://${debuggerHost}:3001`,
  apiTimeout: 35000,
} as const;
