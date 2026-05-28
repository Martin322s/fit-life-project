import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/server/require-auth";
import * as repo from "@/src/lib/server/repositories/meals";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId, role } = auth.payload;

  try {
    const items = role === "admin" ? await repo.listAll() : await repo.listByUser(userId);
    return NextResponse.json({ items });
  } catch (err) {
    console.error("GET /api/meals", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId } = auth.payload;

  try {
    const body = await request.json().catch(() => null);

    if (!body?.title || body?.calories == null) {
      return NextResponse.json(
        { message: "title and calories are required." },
        { status: 400 },
      );
    }

    const item = await repo.create(userId, {
      title: String(body.title),
      calories: Number(body.calories),
      protein: body.protein != null ? Number(body.protein) : null,
      carbs: body.carbs != null ? Number(body.carbs) : null,
      fat: body.fat != null ? Number(body.fat) : null,
      notes: body.notes ? String(body.notes) : null,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error("POST /api/meals", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
