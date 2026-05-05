import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../../db";
import { recipes } from "../../db/schema";
import type { DbRecipe } from "../../db/schema";

export type RecipeInput = {
  title: string;
  description: string;
  category: string;
  imageUrl?: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepMinutes: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
};

export type UpdateRecipeInput = Partial<RecipeInput>;

export type ListRecipesInput = {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  difficulty?: string;
};

function buildFilters(input: ListRecipesInput) {
  const parts = [];
  if (input.search) {
    const q = `%${input.search}%`;
    parts.push(or(ilike(recipes.title, q), ilike(recipes.description, q)));
  }
  if (input.category) parts.push(eq(recipes.category, input.category));
  if (input.difficulty) parts.push(eq(recipes.difficulty, input.difficulty));
  return parts.length ? and(...parts) : undefined;
}

export async function list(input: ListRecipesInput): Promise<{ items: DbRecipe[]; total: number }> {
  const where = buildFilters(input);
  const offset = (input.page - 1) * input.limit;

  const totalRows = await db.select({ value: count() }).from(recipes).where(where);
  const items = await db
    .select()
    .from(recipes)
    .where(where)
    .orderBy(asc(recipes.category), desc(recipes.createdAt))
    .limit(input.limit)
    .offset(offset);

  return { items, total: totalRows[0]?.value ?? 0 };
}

export async function findById(id: string): Promise<DbRecipe | undefined> {
  const rows = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
  return rows[0];
}

export async function findByTitle(title: string): Promise<DbRecipe | undefined> {
  const rows = await db
    .select()
    .from(recipes)
    .where(sql`lower(${recipes.title}) = ${title.toLowerCase()}`)
    .limit(1);
  return rows[0];
}

export async function create(data: RecipeInput): Promise<DbRecipe> {
  const rows = await db.insert(recipes).values(data).returning();
  return rows[0];
}

export async function update(id: string, data: UpdateRecipeInput): Promise<DbRecipe | undefined> {
  if (Object.keys(data).length === 0) return findById(id);
  const rows = await db
    .update(recipes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(recipes.id, id))
    .returning();
  return rows[0];
}

export async function remove(id: string): Promise<boolean> {
  const rows = await db.delete(recipes).where(eq(recipes.id, id)).returning({ id: recipes.id });
  return rows.length > 0;
}
