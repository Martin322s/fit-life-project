import { eq, desc } from "drizzle-orm";
import { db } from "../../db";
import { progressEntries } from "../../db/schema";
import type { DbProgressEntry } from "../../db/schema";

export type CreateProgressInput = {
  weightKg?: number | null;
  waistCm?: number | null;
  notes?: string | null;
};

export function listByUser(userId: string): Promise<DbProgressEntry[]> {
  return db
    .select()
    .from(progressEntries)
    .where(eq(progressEntries.userId, userId))
    .orderBy(desc(progressEntries.createdAt));
}

export function listAll(): Promise<DbProgressEntry[]> {
  return db.select().from(progressEntries).orderBy(desc(progressEntries.createdAt));
}

export async function findById(id: string): Promise<DbProgressEntry | undefined> {
  const rows = await db.select().from(progressEntries).where(eq(progressEntries.id, id)).limit(1);
  return rows[0];
}

export async function create(userId: string, data: CreateProgressInput): Promise<DbProgressEntry> {
  const rows = await db.insert(progressEntries).values({ ...data, userId }).returning();
  return rows[0];
}

export async function remove(id: string): Promise<boolean> {
  const rows = await db
    .delete(progressEntries)
    .where(eq(progressEntries.id, id))
    .returning({ id: progressEntries.id });
  return rows.length > 0;
}
