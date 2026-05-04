import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import * as repo from "@/lib/repositories/goals";
import type { GoalStatus } from "@/db/schema";

export const runtime = "nodejs";

const VALID_STATUSES: GoalStatus[] = ["active", "completed", "abandoned"];

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId, role } = auth.payload;

  try {
    const items = role === "admin" ? await repo.listAll() : await repo.listByUser(userId);
    return NextResponse.json({ items });
  } catch (err) {
    console.error("GET /api/goals", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId } = auth.payload;

  try {
    const body = await request.json().catch(() => null);

    if (!body?.title || body?.targetValue == null || !body?.unit) {
      return NextResponse.json(
        { message: "title, targetValue, and unit are required." },
        { status: 400 },
      );
    }

    if (body.status && !VALID_STATUSES.includes(body.status as GoalStatus)) {
      return NextResponse.json(
        { message: `status must be one of: ${VALID_STATUSES.join(", ")}.` },
        { status: 400 },
      );
    }

    const item = await repo.create(userId, {
      title: String(body.title),
      targetValue: Number(body.targetValue),
      currentValue: body.currentValue != null ? Number(body.currentValue) : 0,
      unit: String(body.unit),
      status: (body.status as GoalStatus) ?? "active",
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error("POST /api/goals", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
