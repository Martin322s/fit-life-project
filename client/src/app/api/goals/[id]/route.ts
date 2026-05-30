import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidden, notFound } from "@/src/lib/server/require-auth";
import * as repo from "@/src/lib/server/repositories/goals";
import type { GoalStatus } from "@/src/db/schema";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

const VALID_STATUSES: GoalStatus[] = ["active", "completed", "abandoned"];

export async function GET(request: NextRequest, props: Props) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId, role } = auth.payload;
  const { id } = await props.params;

  try {
    const item = await repo.findById(id);
    if (!item) return notFound("Goal");
    if (item.userId !== userId && role !== "admin") return forbidden();
    return NextResponse.json({ item });
  } catch (err) {
    console.error("GET /api/goals/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, props: Props) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId, role } = auth.payload;
  const { id } = await props.params;

  try {
    const item = await repo.findById(id);
    if (!item) return notFound("Goal");
    if (item.userId !== userId && role !== "admin") return forbidden();

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    if (body.status && !VALID_STATUSES.includes(body.status as GoalStatus)) {
      return NextResponse.json(
        { message: `status must be one of: ${VALID_STATUSES.join(", ")}.` },
        { status: 400 },
      );
    }

    const patch: repo.UpdateGoalInput = {};
    if (body.title !== undefined) patch.title = String(body.title);
    if (body.targetValue !== undefined) patch.targetValue = Number(body.targetValue);
    if (body.currentValue !== undefined) patch.currentValue = Number(body.currentValue);
    if (body.unit !== undefined) patch.unit = String(body.unit);
    if (body.status !== undefined) patch.status = body.status as GoalStatus;

    const updated = await repo.update(id, patch);
    return NextResponse.json({ item: updated });
  } catch (err) {
    console.error("PATCH /api/goals/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: Props) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId, role } = auth.payload;
  const { id } = await props.params;

  try {
    const item = await repo.findById(id);
    if (!item) return notFound("Goal");
    if (item.userId !== userId && role !== "admin") return forbidden();

    await repo.remove(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/goals/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
