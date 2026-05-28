import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidden, notFound } from "@/src/lib/server/require-auth";
import { parseDietPatch } from "@/src/lib/server/diets-validation";
import * as repo from "@/src/lib/server/repositories/diets";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, props: Props) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { id } = await props.params;

  try {
    const item = await repo.findById(id);
    if (!item) return notFound("Diet");
    return NextResponse.json({ item });
  } catch (err) {
    console.error("GET /api/diets/[id]", err);
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
    if (!item) return notFound("Diet");

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const patch = parseDietPatch(body);
    if (patch instanceof NextResponse) return patch;

    const updated = await repo.update(id, patch);
    return NextResponse.json({ item: updated });
  } catch (err) {
    console.error("PATCH /api/diets/[id]", err);
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
    if (!item) return notFound("Diet");

    await repo.remove(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/diets/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
