import { desc, eq } from "drizzle-orm";
import { db } from "@/src/db";
import { progressEntries, users } from "@/src/db/schema";

type ActivityLevel = "sedentary" | "light" | "moderate" | "very";
type GoalType = "lose_weight" | "maintain" | "gain_weight";

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: "male" | "female" | null;
  age: number | null;
  heightCm: number | null;
  currentWeight: number | null;
  goalWeight: number | null;
  activityLevel: ActivityLevel | null;
  goalType: GoalType | null;
  caloriesTarget: number | null;
  proteinTarget: number | null;
  carbsTarget: number | null;
  fatTarget: number | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  gender?: "male" | "female" | null;
  age?: number | null;
  heightCm?: number | null;
  goalWeight?: number | null;
  activityLevel?: ActivityLevel | null;
  goalType?: GoalType | null;
  caloriesTarget?: number | null;
  proteinTarget?: number | null;
  carbsTarget?: number | null;
  fatTarget?: number | null;
  avatarUrl?: string | null;
};

function mapLegacyGoalToGoalType(goal: string | null): GoalType | null {
  if (goal === "lose") return "lose_weight";
  if (goal === "maintain") return "maintain";
  if (goal === "gain") return "gain_weight";
  return null;
}

function mapGoalTypeToLegacyGoal(goalType: GoalType | null | undefined): "lose" | "maintain" | "gain" | null {
  if (goalType === "lose_weight") return "lose";
  if (goalType === "maintain") return "maintain";
  if (goalType === "gain_weight") return "gain";
  return null;
}

function toHeightCm(height: number | null, unit: string | null): number | null {
  if (height == null) return null;
  if (unit === "ft") return +(height * 30.48).toFixed(1);
  return height;
}

export async function getByUserId(userId: string): Promise<Profile | null> {
  const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const user = rows[0];
  if (!user) return null;

  const latestProgressRows = await db
    .select({ weightKg: progressEntries.weightKg })
    .from(progressEntries)
    .where(eq(progressEntries.userId, userId))
    .orderBy(desc(progressEntries.createdAt))
    .limit(1);

  const latestWeight = latestProgressRows[0]?.weightKg ?? null;

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    gender: user.gender as "male" | "female" | null,
    age: user.age,
    heightCm: user.heightCm ?? toHeightCm(user.height, user.heightUnit),
    currentWeight: latestWeight,
    goalWeight: user.goalWeight,
    activityLevel: (user.activityLevel ?? user.activity ?? null) as ActivityLevel | null,
    goalType: (user.goalType ?? mapLegacyGoalToGoalType(user.goal)) as GoalType | null,
    caloriesTarget: user.caloriesTarget,
    proteinTarget: user.proteinTarget,
    carbsTarget: user.carbsTarget,
    fatTarget: user.fatTarget,
    avatarUrl: user.avatarUrl ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function updateByUserId(userId: string, patch: UpdateProfileInput): Promise<Profile | null> {
  const nextGoalLegacy = patch.goalType === undefined ? undefined : mapGoalTypeToLegacyGoal(patch.goalType);

  await db
    .update(users)
    .set({
      ...patch,
      ...(patch.heightCm !== undefined ? { height: patch.heightCm, heightUnit: patch.heightCm == null ? null : "cm" } : {}),
      ...(patch.activityLevel !== undefined ? { activity: patch.activityLevel } : {}),
      ...(nextGoalLegacy !== undefined ? { goal: nextGoalLegacy } : {}),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return getByUserId(userId);
}
