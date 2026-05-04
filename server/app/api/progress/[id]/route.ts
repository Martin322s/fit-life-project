import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidden, notFound } from "@/lib/require-auth";
import * as repo from "@/lib/repositories/progress";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, props: Props) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId, role } = auth.payload;
  const { id } = await props.params;

  try {
    const item = await repo.findById(id);
    if (!item) return notFound("Progress entry");
    if (item.userId !== userId && role !== "admin") return forbidden();
    return NextResponse.json({ item });
  } catch (err) {
    console.error("GET /api/progress/[id]", err);
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
    if (!item) return notFound("Progress entry");
    if (item.userId !== userId && role !== "admin") return forbidden();

    await repo.remove(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/progress/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
