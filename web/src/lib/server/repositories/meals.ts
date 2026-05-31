import { eq, desc } from "drizzle-orm";
import { db } from "@/src/db";
import { meals } from "@/src/db/schema";
import type { DbMeal } from "@/src/db/schema";

export type CreateMealInput = {
  title: string;
  calories: number;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  notes?: string | null;
};

export type UpdateMealInput = Partial<CreateMealInput>;

export function listByUser(userId: string): Promise<DbMeal[]> {
  return db.select().from(meals).where(eq(meals.userId, userId)).orderBy(desc(meals.createdAt));
}

export function listAll(): Promise<DbMeal[]> {
  return db.select().from(meals).orderBy(desc(meals.createdAt));
}

export async function findById(id: string): Promise<DbMeal | undefined> {
  const rows = await db.select().from(meals).where(eq(meals.id, id)).limit(1);
  return rows[0];
}

export async function create(userId: string, data: CreateMealInput): Promise<DbMeal> {
  const rows = await db.insert(meals).values({ ...data, userId }).returning();
  return rows[0];
}

export async function update(id: string, data: UpdateMealInput): Promise<DbMeal | undefined> {
  if (Object.keys(data).length === 0) return findById(id);
  const rows = await db
    .update(meals)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(meals.id, id))
    .returning();
  return rows[0];
}

export async function remove(id: string): Promise<boolean> {
  const rows = await db.delete(meals).where(eq(meals.id, id)).returning({ id: meals.id });
  return rows.length > 0;
}
