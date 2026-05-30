import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/src/db";
import { diets } from "@/src/db/schema";
import type { DbDiet } from "@/src/db/schema";

export type DietInput = {
  title: string;
  description: string;
  category: string;
  goalType: "lose_weight" | "maintain_weight" | "gain_weight" | "health";
  durationDays: number;
  difficulty: string;
  caloriesPerDay: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  rules: string[];
  sampleMenu: string[];
  suitableFor: string[];
  notSuitableFor: string[];
};

export type UpdateDietInput = Partial<DietInput>;

export type ListDietsInput = {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  goalType?: string;
  difficulty?: string;
};

function buildFilters(input: ListDietsInput) {
  const parts = [];
  if (input.search) {
    const q = `%${input.search}%`;
    parts.push(or(ilike(diets.title, q), ilike(diets.description, q)));
  }
  if (input.category) parts.push(eq(diets.category, input.category));
  if (input.goalType) parts.push(eq(diets.goalType, input.goalType as DietInput["goalType"]));
  if (input.difficulty) parts.push(eq(diets.difficulty, input.difficulty));
  return parts.length ? and(...parts) : undefined;
}

export async function list(input: ListDietsInput): Promise<{ items: DbDiet[]; total: number }> {
  const where = buildFilters(input);
  const offset = (input.page - 1) * input.limit;

  const totalRows = await db.select({ value: count() }).from(diets).where(where);
  const items = await db
    .select()
    .from(diets)
    .where(where)
    .orderBy(asc(diets.category), desc(diets.createdAt))
    .limit(input.limit)
    .offset(offset);

  return { items, total: totalRows[0]?.value ?? 0 };
}

export async function findById(id: string): Promise<DbDiet | undefined> {
  const rows = await db.select().from(diets).where(eq(diets.id, id)).limit(1);
  return rows[0];
}

export async function findByTitle(title: string): Promise<DbDiet | undefined> {
  const rows = await db
    .select()
    .from(diets)
    .where(sql`lower(${diets.title}) = ${title.toLowerCase()}`)
    .limit(1);
  return rows[0];
}

export async function create(data: DietInput): Promise<DbDiet> {
  const rows = await db.insert(diets).values(data).returning();
  return rows[0];
}

export async function update(id: string, data: UpdateDietInput): Promise<DbDiet | undefined> {
  if (Object.keys(data).length === 0) return findById(id);
  const rows = await db
    .update(diets)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(diets.id, id))
    .returning();
  return rows[0];
}

export async function remove(id: string): Promise<boolean> {
  const rows = await db.delete(diets).where(eq(diets.id, id)).returning({ id: diets.id });
  return rows.length > 0;
}
