import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/server/require-auth";
import * as repo from "@/src/lib/server/repositories/workouts";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId, role } = auth.payload;

  try {
    const items = role === "admin" ? await repo.listAll() : await repo.listByUser(userId);
    return NextResponse.json({ items });
  } catch (err) {
    console.error("GET /api/workouts", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId } = auth.payload;

  try {
    const body = await request.json().catch(() => null);

    if (!body?.title || !body?.type || body?.durationMinutes == null) {
      return NextResponse.json(
        { message: "title, type, and durationMinutes are required." },
        { status: 400 },
      );
    }

    const item = await repo.create(userId, {
      title: String(body.title),
      type: String(body.type),
      durationMinutes: Number(body.durationMinutes),
      caloriesBurned: body.caloriesBurned != null ? Number(body.caloriesBurned) : null,
      notes: body.notes ? String(body.notes) : null,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error("POST /api/workouts", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
