import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body?.token || !body?.password) {
      return NextResponse.json(
        { message: "Токенът и новата парола са задължителни." },
        { status: 400 },
      );
    }

    await resetPassword(body.token, body.password);

    return NextResponse.json({ message: "Паролата е сменена успешно." }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "invalid_or_expired_token") {
      return NextResponse.json(
        { message: "Линкът е невалиден или е изтекъл. Заяви нов." },
        { status: 400 },
      );
    }
    if (msg === "password_too_short") {
      return NextResponse.json({ message: "Паролата трябва да е поне 8 символа." }, { status: 400 });
    }
    console.error("POST /api/auth/reset-password", err);
    return NextResponse.json({ message: "Сървърна грешка. Опитай отново." }, { status: 500 });
  }
}
