import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { hydrationEntries } from "@/db/schema";
import type { DbHydrationEntry } from "@/db/schema";

export async function listToday(userId: string): Promise<DbHydrationEntry[]> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return db
    .select()
    .from(hydrationEntries)
    .where(and(eq(hydrationEntries.userId, userId), gte(hydrationEntries.createdAt, startOfDay)))
    .orderBy(desc(hydrationEntries.createdAt));
}

export async function listAll(userId: string): Promise<DbHydrationEntry[]> {
  return db
    .select()
    .from(hydrationEntries)
    .where(eq(hydrationEntries.userId, userId))
    .orderBy(desc(hydrationEntries.createdAt));
}

export async function create(userId: string, amountMl: number): Promise<DbHydrationEntry> {
  const rows = await db
    .insert(hydrationEntries)
    .values({ userId, amountMl })
    .returning();
  return rows[0];
}

export async function remove(id: string, userId: string): Promise<boolean> {
  const rows = await db
    .delete(hydrationEntries)
    .where(and(eq(hydrationEntries.id, id), eq(hydrationEntries.userId, userId)))
    .returning({ id: hydrationEntries.id });
  return rows.length > 0;
}
