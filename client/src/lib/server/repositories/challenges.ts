import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/src/db";
import { challenges } from "@/src/db/schema";
import type { ChallengeTargetType, DbChallenge } from "@/src/db/schema";

export type ChallengeInput = {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  durationDays: number;
  targetType: ChallengeTargetType;
  targetValue: number;
  targetUnit: string;
  rewardText: string | null;
  rules: string[];
  imageUrl: string | null;
};

export type UpdateChallengeInput = Partial<ChallengeInput>;

export type ListChallengesInput = {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  difficulty?: string;
  targetType?: string;
};

function buildFilters(input: ListChallengesInput) {
  const parts = [];
  if (input.search) {
    const q = `%${input.search}%`;
    parts.push(or(ilike(challenges.title, q), ilike(challenges.description, q)));
  }
  if (input.category) parts.push(eq(challenges.category, input.category));
  if (input.difficulty) parts.push(eq(challenges.difficulty, input.difficulty));
  if (input.targetType) parts.push(eq(challenges.targetType, input.targetType as ChallengeTargetType));
  return parts.length ? and(...parts) : undefined;
}

export async function list(input: ListChallengesInput): Promise<{ items: DbChallenge[]; total: number }> {
  const where = buildFilters(input);
  const offset = (input.page - 1) * input.limit;

  const totalRows = await db.select({ value: count() }).from(challenges).where(where);
  const items = await db
    .select()
    .from(challenges)
    .where(where)
    .orderBy(asc(challenges.category), desc(challenges.createdAt))
    .limit(input.limit)
    .offset(offset);

  return { items, total: totalRows[0]?.value ?? 0 };
}

export async function findById(id: string): Promise<DbChallenge | undefined> {
  const rows = await db.select().from(challenges).where(eq(challenges.id, id)).limit(1);
  return rows[0];
}

export async function findByTitle(title: string): Promise<DbChallenge | undefined> {
  const rows = await db
    .select()
    .from(challenges)
    .where(sql`lower(${challenges.title}) = ${title.toLowerCase()}`)
    .limit(1);
  return rows[0];
}

export async function create(data: ChallengeInput): Promise<DbChallenge> {
  const rows = await db.insert(challenges).values(data).returning();
  return rows[0];
}

export async function update(id: string, data: UpdateChallengeInput): Promise<DbChallenge | undefined> {
  if (Object.keys(data).length === 0) return findById(id);
  const rows = await db
    .update(challenges)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(challenges.id, id))
    .returning();
  return rows[0];
}

export async function remove(id: string): Promise<boolean> {
  const rows = await db.delete(challenges).where(eq(challenges.id, id)).returning({ id: challenges.id });
  return rows.length > 0;
}
