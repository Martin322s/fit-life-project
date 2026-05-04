import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidden } from "@/lib/require-auth";
import { parseProductCreate } from "@/lib/products-validation";
import * as repo from "@/lib/repositories/products";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
    const limit = Math.min(80, Math.max(1, Number(searchParams.get("limit") ?? 20) || 20));
    const search = searchParams.get("search")?.trim() || undefined;
    const category = searchParams.get("category")?.trim() || undefined;
    const minProteinRaw = searchParams.get("minProtein");
    const maxCaloriesRaw = searchParams.get("maxCalories");
    const maxCarbsRaw = searchParams.get("maxCarbs");
    const minProtein = minProteinRaw ? Number(minProteinRaw) : undefined;
    const maxCalories = maxCaloriesRaw ? Number(maxCaloriesRaw) : undefined;
    const maxCarbs = maxCarbsRaw ? Number(maxCarbsRaw) : undefined;

    const { items, total } = await repo.list({ page, limit, search, category, minProtein, maxCalories, maxCarbs });
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return NextResponse.json({ items, page, limit, total, totalPages });
  } catch (err) {
    console.error("GET /api/products", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  if (auth.payload.role !== "admin") return forbidden();

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const input = parseProductCreate(body);
    if (input instanceof NextResponse) return input;

    const item = await repo.create(input);
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error("POST /api/products", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
