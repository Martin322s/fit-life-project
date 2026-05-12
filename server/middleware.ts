import { NextRequest, NextResponse } from "next/server";

function allowedOrigins(): string[] {
  const configured = [
    process.env.CLIENT_URL,
    process.env.SERVER_URL,
    process.env.MOBILE_URL,
    ...(process.env.CORS_ALLOWED_ORIGINS?.split(",") ?? []),
  ]
    .map((origin) => origin?.trim())
    .filter((origin): origin is string => Boolean(origin));

  if (process.env.NODE_ENV !== "production") {
    configured.push(
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:8081",
      "http://127.0.0.1:8081",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
    );
  }

  return Array.from(new Set(configured));
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const origins = allowedOrigins();
  const allowed = origins.includes(origin) ? origin : origins[0] ?? "";

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowed,
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
      },
    });
  }

  const response = NextResponse.next();
  if (allowed) response.headers.set("Access-Control-Allow-Origin", allowed);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Vary", "Origin");
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
