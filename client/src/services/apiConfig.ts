const LOCAL_API_URL = "http://localhost:3001";
const PRODUCTION_API_URL = "https://fit-life-api.netlify.app";

export const API_BASE_URL =
  import.meta.env.PROD ? PRODUCTION_API_URL : import.meta.env.VITE_API_BASE_URL ?? LOCAL_API_URL;
