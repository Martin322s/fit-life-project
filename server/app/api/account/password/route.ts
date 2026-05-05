import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/require-auth";
import { findById } from "@/lib/users";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ message: "Невалидно тяло на заявката." }, { status: 400 });
    }

    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword.trim() : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword.trim() : "";

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Текущата и новата парола са задължителни." }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ message: "Новата парола трябва да е поне 8 символа." }, { status: 400 });
    }

    const user = await findById(auth.payload.sub);
    if (!user) {
      return NextResponse.json({ message: "Потребителят не е намерен." }, { status: 404 });
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ message: "Текущата парола е грешна." }, { status: 400 });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await db
      .update(users)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(users.id, auth.payload.sub));

    return NextResponse.json({ message: "Паролата е сменена успешно." });
  } catch (err) {
    console.error("PATCH /api/account/password", err);
    return NextResponse.json({ message: "Сървърна грешка." }, { status: 500 });
  }
}
