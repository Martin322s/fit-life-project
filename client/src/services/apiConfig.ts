// The web client and API now run in the same Next.js app (unified full-stack app).
// For web requests, API calls are same-origin (/api/...) — no base URL needed.
// NEXT_PUBLIC_API_BASE_URL is used only by the Expo mobile app to reach the deployed API.
export const API_BASE_URL = "";
