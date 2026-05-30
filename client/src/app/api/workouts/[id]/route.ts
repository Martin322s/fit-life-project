import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidden, notFound } from "@/src/lib/server/require-auth";
import * as repo from "@/src/lib/server/repositories/workouts";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, props: Props) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  const { sub: userId, role } = auth.payload;
  const { id } = await props.params;

  try {
    const item = await repo.findById(id);
    if (!item) return notFound("Workout");
    if (item.userId !== userId && role !== "admin") return forbidden();
    return NextResponse.json({ item });
  } catch (err) {
    console.error("GET /api/workouts/[id]", err);
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
    if (!item) return notFound("Workout");
    if (item.userId !== userId && role !== "admin") return forbidden();

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const patch: repo.UpdateWorkoutInput = {};
    if (body.title !== undefined) patch.title = String(body.title);
    if (body.type !== undefined) patch.type = String(body.type);
    if (body.durationMinutes !== undefined) patch.durationMinutes = Number(body.durationMinutes);
    if (body.caloriesBurned !== undefined) patch.caloriesBurned = body.caloriesBurned != null ? Number(body.caloriesBurned) : null;
    if (body.notes !== undefined) patch.notes = body.notes ? String(body.notes) : null;

    const updated = await repo.update(id, patch);
    return NextResponse.json({ item: updated });
  } catch (err) {
    console.error("PATCH /api/workouts/[id]", err);
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
    if (!item) return notFound("Workout");
    if (item.userId !== userId && role !== "admin") return forbidden();

    await repo.remove(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/workouts/[id]", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
