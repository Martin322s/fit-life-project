import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, getFullUserById } from "@/src/lib/server/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const payload = getUserFromToken(request.headers.get("authorization"));
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await getFullUserById(payload.sub);
  if (!user) {
    return NextResponse.json({ message: "Потребителят не е намерен." }, { status: 404 });
  }

  return NextResponse.json({ user }, { status: 200 });
}
