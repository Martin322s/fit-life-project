import { NextRequest, NextResponse } from "next/server";

const COOKIE = "fitlife-token";

// Routes that require the user to be authenticated.
const AUTH_ROUTES = new Set([
  "/dashboard",
  "/profile",
  "/weight",
  "/calories",
  "/challenges",
  "/calculators",
  "/recipes",
  "/diets",
  "/training-plans",
  "/products",
  "/admin",
]);

// Routes that require admin role (must also be in AUTH_ROUTES).
const ADMIN_ROUTES = new Set(["/admin"]);

// Routes that authenticated users should not visit (redirect them to /dashboard).
const GUEST_ROUTES = new Set(["/login", "/register", "/forgot-password"]);

/**
 * Minimal HMAC-SHA256 JWT verification using the Web Crypto API.
 *
 * This intentionally does NOT import from src/lib/server/jwt.ts because that
 * module uses the `jsonwebtoken` package which relies on Node.js built-ins that
 * are not available in the Edge runtime. The logic here is equivalent for the
 * HS256 algorithm used throughout the app.
 */
async function verifyJwt(
  token: string,
  secret: string,
): Promise<{ sub: string; role: string } | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signatureB64] = parts as [string, string, string];

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const sigBytes = Uint8Array.from(
      atob(signatureB64.replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0),
    );
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const valid = await crypto.subtle.verify("HMAC", cryptoKey, sigBytes, data);
    if (!valid) return null;

    const raw = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(raw) as { sub?: string; role?: string; exp?: number };

    if (typeof payload.sub !== "string" || typeof payload.role !== "string") return null;
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;

    return { sub: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.has(pathname);
  const isAdminRoute = ADMIN_ROUTES.has(pathname);
  const isGuestRoute = GUEST_ROUTES.has(pathname);

  // Skip routes not managed by this middleware.
  if (!isAuthRoute && !isGuestRoute) return NextResponse.next();

  const token = request.cookies.get(COOKIE)?.value ?? null;
  const secret = process.env.JWT_SECRET ?? null;

  let payload: { sub: string; role: string } | null = null;
  if (token && secret) {
    payload = await verifyJwt(token, secret);
  }

  // Unauthenticated request to a protected route → send to /login.
  if (isAuthRoute && !payload) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated non-admin trying to access /admin → send to /dashboard.
  if (isAdminRoute && payload?.role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Authenticated user visiting a guest-only page → send to /dashboard.
  if (isGuestRoute && payload) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes
    "/dashboard",
    "/profile",
    "/weight",
    "/calories",
    "/challenges",
    "/calculators",
    "/recipes",
    "/diets",
    "/training-plans",
    "/products",
    "/admin",
    // Guest-only routes (redirect authenticated users away)
    "/login",
    "/register",
    "/forgot-password",
  ],
};
