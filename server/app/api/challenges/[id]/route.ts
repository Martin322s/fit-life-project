import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidden, notFound } from "@/lib/require-auth";
import { parseChallengePatch } from "@/lib/challenges-validation";
import * as repo from "@/lib/repositories/challenges";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, props: Props) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { id } = await props.params;

  try {
    const item = await repo.findById(id);
    if (!item) return notFound("Challenge");
    return NextResponse.json({ item });
  } catch (err) {
    console.error("GET /api/challenges/[id]", err);
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
    if (!item) return notFound("Challenge");

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const patch = parseChallengePatch(body);
    if (patch instanceof NextResponse) return patch;

    const updated = await repo.update(id, patch);
    return NextResponse.json({ item: updated });
  } catch (err) {
    console.error("PATCH /api/challenges/[id]", err);
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
    if (!item) return notFound("Challenge");

    await repo.remove(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/challenges/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
