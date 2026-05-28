import { NextRequest, NextResponse } from "next/server";
import { requireAuth, notFound } from "@/src/lib/server/require-auth";
import * as challengesRepo from "@/src/lib/server/repositories/challenges";
import * as repo from "@/src/lib/server/repositories/user-challenges";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId, role } = auth.payload;

  try {
    const items = role === "admin" ? await repo.listAll() : await repo.listByUser(userId);
    return NextResponse.json({ items });
  } catch (err) {
    console.error("GET /api/user-challenges", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId } = auth.payload;

  try {
    const body = (await request.json().catch(() => null)) as { challengeId?: string } | null;
    if (!body?.challengeId) {
      return NextResponse.json({ message: "challengeId is required." }, { status: 400 });
    }

    const challenge = await challengesRepo.findById(body.challengeId);
    if (!challenge) return notFound("Challenge");

    const existingActive = await repo.findActiveByUserAndChallenge(userId, body.challengeId);
    if (existingActive) {
      return NextResponse.json({ message: "Challenge already active for this user." }, { status: 409 });
    }

    const created = await repo.create(userId, { challengeId: body.challengeId });
    const item = await repo.findWithChallengeById(created.id);

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error("POST /api/user-challenges", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
