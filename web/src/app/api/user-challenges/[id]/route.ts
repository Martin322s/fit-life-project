import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidden, notFound } from "@/src/lib/server/require-auth";
import type { UserChallengeStatus } from "@/src/db/schema";
import * as repo from "@/src/lib/server/repositories/user-challenges";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

const VALID_STATUSES: UserChallengeStatus[] = ["active", "completed", "abandoned"];

export async function PATCH(request: NextRequest, props: Props) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId, role } = auth.payload;
  const { id } = await props.params;

  try {
    const existing = await repo.findWithChallengeById(id);
    if (!existing) return notFound("User challenge");
    if (existing.userId !== userId && role !== "admin") return forbidden();

    const body = (await request.json().catch(() => null)) as { progressValue?: number; status?: UserChallengeStatus } | null;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ message: `status must be one of: ${VALID_STATUSES.join(", ")}.` }, { status: 400 });
    }

    const patch: repo.UpdateUserChallengeInput = {};
    if (body.progressValue !== undefined) {
      patch.progressValue = Math.max(0, Number(body.progressValue));
    }

    if (body.status !== undefined) {
      patch.status = body.status;
      patch.completedAt = body.status === "completed" ? new Date() : null;
    }

    const nextProgress = patch.progressValue ?? existing.progressValue;
    if ((patch.status === undefined || patch.status === "active") && nextProgress >= existing.challenge.targetValue) {
      patch.status = "completed";
      patch.completedAt = new Date();
    }

    const updated = await repo.update(id, patch);
    const item = updated ? await repo.findWithChallengeById(updated.id) : undefined;
    return NextResponse.json({ item });
  } catch (err) {
    console.error("PATCH /api/user-challenges/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: Props) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId, role } = auth.payload;
  const { id } = await props.params;

  try {
    const existing = await repo.findById(id);
    if (!existing) return notFound("User challenge");
    if (existing.userId !== userId && role !== "admin") return forbidden();

    await repo.remove(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/user-challenges/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
