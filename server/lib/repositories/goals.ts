import { eq, desc } from "drizzle-orm";
import { db } from "../../db";
import { goals } from "../../db/schema";
import type { DbGoal, GoalStatus } from "../../db/schema";

export type CreateGoalInput = {
  title: string;
  targetValue: number;
  currentValue?: number;
  unit: string;
  status?: GoalStatus;
};

export type UpdateGoalInput = Partial<CreateGoalInput>;

export function listByUser(userId: string): Promise<DbGoal[]> {
  return db.select().from(goals).where(eq(goals.userId, userId)).orderBy(desc(goals.createdAt));
}

export function listAll(): Promise<DbGoal[]> {
  return db.select().from(goals).orderBy(desc(goals.createdAt));
}

export async function findById(id: string): Promise<DbGoal | undefined> {
  const rows = await db.select().from(goals).where(eq(goals.id, id)).limit(1);
  return rows[0];
}

export async function create(userId: string, data: CreateGoalInput): Promise<DbGoal> {
  const rows = await db.insert(goals).values({ ...data, userId }).returning();
  return rows[0];
}

export async function update(id: string, data: UpdateGoalInput): Promise<DbGoal | undefined> {
  if (Object.keys(data).length === 0) return findById(id);
  const rows = await db
    .update(goals)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(goals.id, id))
    .returning();
  return rows[0];
}

export async function remove(id: string): Promise<boolean> {
  const rows = await db.delete(goals).where(eq(goals.id, id)).returning({ id: goals.id });
  return rows.length > 0;
}
