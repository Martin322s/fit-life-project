import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidden, notFound } from "@/src/lib/server/require-auth";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  if (auth.payload.role !== "admin") return forbidden();

  const { id } = await params;

  if (id === auth.payload.sub) {
    return NextResponse.json({ message: "Не можеш да промениш собствената си роля." }, { status: 400 });
  }

  try {
    const body = (await request.json().catch(() => null)) as { role?: unknown } | null;
    const role = body?.role;
    if (role !== "user" && role !== "admin") {
      return NextResponse.json({ message: "Ролята трябва да е 'user' или 'admin'." }, { status: 400 });
    }

    const rows = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning({ id: users.id, role: users.role });

    if (rows.length === 0) return notFound("Потребител");
    return NextResponse.json({ item: rows[0] });
  } catch (err) {
    console.error("PATCH /api/admin/users/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  if (auth.payload.role !== "admin") return forbidden();

  const { id } = await params;

  if (id === auth.payload.sub) {
    return NextResponse.json({ message: "Не можеш да изтриеш собствения си акаунт." }, { status: 400 });
  }

  try {
    const rows = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
    if (rows.length === 0) return notFound("Потребител");
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/admin/users/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
