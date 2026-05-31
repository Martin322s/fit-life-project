import { and, asc, count, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import type { DbProduct } from "@/src/db/schema";

export type ProductInput = {
  name: string;
  description: string;
  category: string;
  brand: string | null;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number | null;
  fiber: number | null;
  salt: number | null;
  barcode: string | null;
  imageUrl: string | null;
  tags: string[];
};

export type UpdateProductInput = Partial<ProductInput>;

export type ListProductsInput = {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  minProtein?: number;
  maxCalories?: number;
  maxCarbs?: number;
};

function buildFilters(input: ListProductsInput) {
  const parts = [];
  if (input.search) {
    const q = `%${input.search}%`;
    parts.push(or(ilike(products.name, q), ilike(products.description, q), ilike(products.brand, q), ilike(products.barcode, q)));
  }
  if (input.category) parts.push(eq(products.category, input.category));
  if (input.minProtein !== undefined) parts.push(gte(products.protein, input.minProtein));
  if (input.maxCalories !== undefined) parts.push(lte(products.calories, input.maxCalories));
  if (input.maxCarbs !== undefined) parts.push(lte(products.carbs, input.maxCarbs));
  return parts.length ? and(...parts) : undefined;
}

export async function list(input: ListProductsInput): Promise<{ items: DbProduct[]; total: number }> {
  const where = buildFilters(input);
  const offset = (input.page - 1) * input.limit;

  const totalRows = await db.select({ value: count() }).from(products).where(where);
  const items = await db
    .select()
    .from(products)
    .where(where)
    .orderBy(asc(products.category), desc(products.createdAt))
    .limit(input.limit)
    .offset(offset);

  return { items, total: totalRows[0]?.value ?? 0 };
}

export async function findById(id: string): Promise<DbProduct | undefined> {
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return rows[0];
}

export async function findByName(name: string): Promise<DbProduct | undefined> {
  const rows = await db
    .select()
    .from(products)
    .where(sql`lower(${products.name}) = ${name.toLowerCase()}`)
    .limit(1);
  return rows[0];
}

export async function create(data: ProductInput): Promise<DbProduct> {
  const rows = await db.insert(products).values(data).returning();
  return rows[0];
}

export async function update(id: string, data: UpdateProductInput): Promise<DbProduct | undefined> {
  if (Object.keys(data).length === 0) return findById(id);
  const rows = await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return rows[0];
}

export async function remove(id: string): Promise<boolean> {
  const rows = await db.delete(products).where(eq(products.id, id)).returning({ id: products.id });
  return rows.length > 0;
}
