import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "./auth";
import type { JwtPayload } from "./jwt";

type AuthOk = { ok: true; payload: JwtPayload };
type AuthFail = { ok: false; response: NextResponse };

export function requireAuth(request: NextRequest): AuthOk | AuthFail {
  const payload = getUserFromToken(request.headers.get("authorization"));
  if (!payload) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true, payload };
}

export function forbidden(): NextResponse {
  return NextResponse.json({ message: "Forbidden" }, { status: 403 });
}

export function notFound(resource = "Resource"): NextResponse {
  return NextResponse.json({ message: `${resource} not found` }, { status: 404 });
}
