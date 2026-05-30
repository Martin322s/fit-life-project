import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidden, notFound } from "@/src/lib/server/require-auth";
import { parseRecipePatch } from "@/src/lib/server/recipes-validation";
import * as repo from "@/src/lib/server/repositories/recipes";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, props: Props) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { id } = await props.params;

  try {
    const item = await repo.findById(id);
    if (!item) return notFound("Recipe");
    return NextResponse.json({ item });
  } catch (err) {
    console.error("GET /api/recipes/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, props: Props) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  if (auth.payload.role !== "admin") return forbidden();
  const { id } = await props.params;

  try {
    const item = await repo.findById(id);
    if (!item) return notFound("Recipe");

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const patch = parseRecipePatch(body);
    if (patch instanceof NextResponse) return patch;

    const updated = await repo.update(id, patch);
    return NextResponse.json({ item: updated });
  } catch (err) {
    console.error("PATCH /api/recipes/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: Props) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  if (auth.payload.role !== "admin") return forbidden();
  const { id } = await props.params;

  try {
    const item = await repo.findById(id);
    if (!item) return notFound("Recipe");

    await repo.remove(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/recipes/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
