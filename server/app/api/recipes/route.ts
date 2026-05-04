import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidden } from "@/lib/require-auth";
import { parseRecipeCreate } from "@/lib/recipes-validation";
import * as repo from "@/lib/repositories/recipes";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
    const limit = Math.min(48, Math.max(1, Number(searchParams.get("limit") ?? 12) || 12));
    const search = searchParams.get("search")?.trim() || undefined;
    const category = searchParams.get("category")?.trim() || undefined;
    const difficulty = searchParams.get("difficulty")?.trim() || undefined;

    const { items, total } = await repo.list({ page, limit, search, category, difficulty });
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return NextResponse.json({ items, page, limit, total, totalPages });
  } catch (err) {
    console.error("GET /api/recipes", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  if (auth.payload.role !== "admin") return forbidden();

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const input = parseRecipeCreate(body);
    if (input instanceof NextResponse) return input;

    const item = await repo.create(input);
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error("POST /api/recipes", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
