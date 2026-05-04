import { NextResponse } from "next/server";

export const runtime = "nodejs";

// JWT is stateless — the client clears the token. This endpoint exists
// so the frontend has a consistent API surface and can be extended later
// (e.g. token revocation list once a DB is available).
export async function POST() {
  return NextResponse.json({ message: "Излязохте успешно." }, { status: 200 });
}
