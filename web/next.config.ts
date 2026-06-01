import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // API routes are served by this same Next.js app (unified full-stack app).
  // No proxy rewrite needed — /api/* is handled by src/app/api/ route handlers.
  // NEXT_PUBLIC_API_BASE_URL is kept only for the Expo mobile app (external client).
};

export default nextConfig;
