import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import * as repo from "@/lib/repositories/hydration";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const items = await repo.listToday(auth.payload.sub);
    const totalMl = items.reduce((sum, e) => sum + e.amountMl, 0);
    return NextResponse.json({ items, totalMl });
  } catch (err) {
    console.error("GET /api/hydration", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json().catch(() => null)) as { amountMl?: unknown } | null;
    const raw = body?.amountMl;
    const amountMl = typeof raw === "number" ? Math.round(raw) : parseInt(String(raw ?? ""), 10);

    if (!Number.isFinite(amountMl) || amountMl <= 0) {
      return NextResponse.json({ message: "amountMl трябва да е положително число." }, { status: 400 });
    }
    if (amountMl > 5000) {
      return NextResponse.json({ message: "amountMl не може да надвишава 5000 мл." }, { status: 400 });
    }

    const item = await repo.create(auth.payload.sub, amountMl);
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error("POST /api/hydration", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
