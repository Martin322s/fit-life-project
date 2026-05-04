import { NextRequest, NextResponse } from "next/server";
import { forgotPassword } from "@/lib/auth";

export const runtime = "nodejs";

const SUCCESS_MSG = "Ако имейлът съществува, ще получиш линк за нулиране на паролата.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body?.email || typeof body.email !== "string") {
      return NextResponse.json({ message: "Имейл адресът е задължителен." }, { status: 400 });
    }

    const result = await forgotPassword(body.email.trim());

    // In development, include the reset URL in the response so devs can test
    // without a real mail server. Remove this in production.
    if (process.env.NODE_ENV !== "production" && result) {
      return NextResponse.json(
        { message: SUCCESS_MSG, devResetUrl: result.resetUrl },
        { status: 200 },
      );
    }

    // Always return the same response regardless of whether the email exists.
    return NextResponse.json({ message: SUCCESS_MSG }, { status: 200 });
  } catch (err) {
    console.error("POST /api/auth/forgot-password", err);
    return NextResponse.json({ message: "Сървърна грешка. Опитай отново." }, { status: 500 });
  }
}
