const LOCAL_API_URL = "http://localhost:3001";
const PRODUCTION_API_URL = "https://fit-life-api.netlify.app";

export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_API_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL ?? LOCAL_API_URL;
