import { NextRequest, NextResponse } from "next/server";
import { requireAuth, notFound } from "@/src/lib/server/require-auth";
import * as repo from "@/src/lib/server/repositories/hydration";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    const deleted = await repo.remove(id, auth.payload.sub);
    if (!deleted) return notFound("Запис за хидратация");
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/hydration/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
