import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/src/lib/server/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body?.email || !body?.password || !body?.firstName || !body?.lastName) {
      return NextResponse.json({ message: "Моля попълни всички задължителни полета." }, { status: 400 });
    }

    if (body.password.length < 8) {
      return NextResponse.json({ message: "Паролата трябва да е поне 8 символа." }, { status: 400 });
    }

    const { user, token } = await registerUser({
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      gender: body.gender,
      age: body.age != null ? Number(body.age) : undefined,
      height: body.height != null ? Number(body.height) : undefined,
      heightUnit: body.heightUnit,
      weight: body.weight != null ? Number(body.weight) : undefined,
      weightUnit: body.weightUnit,
      goal: body.goal,
      activity: body.activity,
    });

    return NextResponse.json({ user, token }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "email_taken") {
      return NextResponse.json(
        { message: "Имейл адресът вече е зает. Опитай с друг." },
        { status: 409 },
      );
    }
    console.error("POST /api/auth/register", err);
    return NextResponse.json({ message: "Сървърна грешка. Опитай отново." }, { status: 500 });
  }
}
