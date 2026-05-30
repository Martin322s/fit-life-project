import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/server/require-auth";
import * as repo from "@/src/lib/server/repositories/progress";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId, role } = auth.payload;

  try {
    const items = role === "admin" ? await repo.listAll() : await repo.listByUser(userId);
    return NextResponse.json({ items });
  } catch (err) {
    console.error("GET /api/progress", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId } = auth.payload;

  try {
    const body = await request.json().catch(() => null);

    if (body?.weightKg == null && body?.waistCm == null) {
      return NextResponse.json(
        { message: "At least one of weightKg or waistCm is required." },
        { status: 400 },
      );
    }

    const item = await repo.create(userId, {
      weightKg: body.weightKg != null ? Number(body.weightKg) : null,
      waistCm: body.waistCm != null ? Number(body.waistCm) : null,
      notes: body.notes ? String(body.notes) : null,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error("POST /api/progress", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
