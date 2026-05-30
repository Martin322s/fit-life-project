import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/src/lib/server/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body?.email || !body?.password) {
      return NextResponse.json({ message: "Имейл и парола са задължителни." }, { status: 400 });
    }

    const { user, token } = await loginUser({ email: body.email, password: body.password });

    return NextResponse.json({ user, token }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "invalid_credentials") {
      return NextResponse.json(
        { message: "Грешен имейл или парола. Опитай отново." },
        { status: 401 },
      );
    }
    console.error("POST /api/auth/login", err);
    return NextResponse.json({ message: "Сървърна грешка. Опитай отново." }, { status: 500 });
  }
}
