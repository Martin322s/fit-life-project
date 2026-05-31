import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/src/db";
import { trainingPlans } from "@/src/db/schema";
import type { DbTrainingPlan } from "@/src/db/schema";

export type TrainingPlanInput = {
  title: string;
  description: string;
  goalType: "lose_weight" | "muscle_gain" | "endurance" | "strength" | "mobility" | "general_fitness";
  level: "beginner" | "intermediate" | "advanced";
  durationWeeks: number;
  sessionsPerWeek: number;
  averageSessionMinutes: number;
  equipment: string[];
  targetMuscles: string[];
  caloriesBurnEstimate: number | null;
  planStructure: string[];
  weeklySchedule: string[];
  safetyNotes: string[];
};

export type UpdateTrainingPlanInput = Partial<TrainingPlanInput>;

export type ListTrainingPlansInput = {
  page: number;
  limit: number;
  search?: string;
  goalType?: string;
  level?: string;
  equipment?: string;
};

function buildFilters(input: ListTrainingPlansInput) {
  const parts = [];
  if (input.search) {
    const q = `%${input.search}%`;
    parts.push(or(ilike(trainingPlans.title, q), ilike(trainingPlans.description, q)));
  }
  if (input.goalType) parts.push(eq(trainingPlans.goalType, input.goalType as TrainingPlanInput["goalType"]));
  if (input.level) parts.push(eq(trainingPlans.level, input.level as TrainingPlanInput["level"]));
  if (input.equipment) parts.push(sql`${trainingPlans.equipment} ? ${input.equipment}`);
  return parts.length ? and(...parts) : undefined;
}

export async function list(input: ListTrainingPlansInput): Promise<{ items: DbTrainingPlan[]; total: number }> {
  const where = buildFilters(input);
  const offset = (input.page - 1) * input.limit;

  const totalRows = await db.select({ value: count() }).from(trainingPlans).where(where);
  const items = await db
    .select()
    .from(trainingPlans)
    .where(where)
    .orderBy(asc(trainingPlans.level), desc(trainingPlans.createdAt))
    .limit(input.limit)
    .offset(offset);

  return { items, total: totalRows[0]?.value ?? 0 };
}

export async function findById(id: string): Promise<DbTrainingPlan | undefined> {
  const rows = await db.select().from(trainingPlans).where(eq(trainingPlans.id, id)).limit(1);
  return rows[0];
}

export async function findByTitle(title: string): Promise<DbTrainingPlan | undefined> {
  const rows = await db
    .select()
    .from(trainingPlans)
    .where(sql`lower(${trainingPlans.title}) = ${title.toLowerCase()}`)
    .limit(1);
  return rows[0];
}

export async function create(data: TrainingPlanInput): Promise<DbTrainingPlan> {
  const rows = await db.insert(trainingPlans).values(data).returning();
  return rows[0];
}

export async function update(id: string, data: UpdateTrainingPlanInput): Promise<DbTrainingPlan | undefined> {
  if (Object.keys(data).length === 0) return findById(id);
  const rows = await db
    .update(trainingPlans)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(trainingPlans.id, id))
    .returning();
  return rows[0];
}

export async function remove(id: string): Promise<boolean> {
  const rows = await db.delete(trainingPlans).where(eq(trainingPlans.id, id)).returning({ id: trainingPlans.id });
  return rows.length > 0;
}
