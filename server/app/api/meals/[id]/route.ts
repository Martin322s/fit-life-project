import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidden, notFound } from "@/lib/require-auth";
import * as repo from "@/lib/repositories/meals";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, props: Props) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId, role } = auth.payload;
  const { id } = await props.params;

  try {
    const item = await repo.findById(id);
    if (!item) return notFound("Meal");
    if (item.userId !== userId && role !== "admin") return forbidden();
    return NextResponse.json({ item });
  } catch (err) {
    console.error("GET /api/meals/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, props: Props) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId, role } = auth.payload;
  const { id } = await props.params;

  try {
    const item = await repo.findById(id);
    if (!item) return notFound("Meal");
    if (item.userId !== userId && role !== "admin") return forbidden();

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const patch: repo.UpdateMealInput = {};
    if (body.title !== undefined) patch.title = String(body.title);
    if (body.calories !== undefined) patch.calories = Number(body.calories);
    if (body.protein !== undefined) patch.protein = body.protein != null ? Number(body.protein) : null;
    if (body.carbs !== undefined) patch.carbs = body.carbs != null ? Number(body.carbs) : null;
    if (body.fat !== undefined) patch.fat = body.fat != null ? Number(body.fat) : null;
    if (body.notes !== undefined) patch.notes = body.notes ? String(body.notes) : null;

    const updated = await repo.update(id, patch);
    return NextResponse.json({ item: updated });
  } catch (err) {
    console.error("PATCH /api/meals/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: Props) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId, role } = auth.payload;
  const { id } = await props.params;

  try {
    const item = await repo.findById(id);
    if (!item) return notFound("Meal");
    if (item.userId !== userId && role !== "admin") return forbidden();

    await repo.remove(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/meals/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
