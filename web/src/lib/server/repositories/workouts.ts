import { eq, desc } from "drizzle-orm";
import { db } from "@/src/db";
import { workouts } from "@/src/db/schema";
import type { DbWorkout } from "@/src/db/schema";

export type CreateWorkoutInput = {
  title: string;
  type: string;
  durationMinutes: number;
  caloriesBurned?: number | null;
  notes?: string | null;
};

export type UpdateWorkoutInput = Partial<CreateWorkoutInput>;

export function listByUser(userId: string): Promise<DbWorkout[]> {
  return db.select().from(workouts).where(eq(workouts.userId, userId)).orderBy(desc(workouts.createdAt));
}

export function listAll(): Promise<DbWorkout[]> {
  return db.select().from(workouts).orderBy(desc(workouts.createdAt));
}

export async function findById(id: string): Promise<DbWorkout | undefined> {
  const rows = await db.select().from(workouts).where(eq(workouts.id, id)).limit(1);
  return rows[0];
}

export async function create(userId: string, data: CreateWorkoutInput): Promise<DbWorkout> {
  const rows = await db.insert(workouts).values({ ...data, userId }).returning();
  return rows[0];
}

export async function update(id: string, data: UpdateWorkoutInput): Promise<DbWorkout | undefined> {
  if (Object.keys(data).length === 0) return findById(id);
  const rows = await db
    .update(workouts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(workouts.id, id))
    .returning();
  return rows[0];
}

export async function remove(id: string): Promise<boolean> {
  const rows = await db.delete(workouts).where(eq(workouts.id, id)).returning({ id: workouts.id });
  return rows.length > 0;
}
