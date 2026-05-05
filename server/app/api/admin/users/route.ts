import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidden } from "@/lib/require-auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export const runtime = "nodejs";

const SAFE_FIELDS = {
  id: users.id,
  email: users.email,
  firstName: users.firstName,
  lastName: users.lastName,
  role: users.role,
  createdAt: users.createdAt,
} as const;

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  if (auth.payload.role !== "admin") return forbidden();

  try {
    const items = await db
      .select(SAFE_FIELDS)
      .from(users)
      .orderBy(asc(users.createdAt));
    return NextResponse.json({ items });
  } catch (err) {
    console.error("GET /api/admin/users", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
