import { NextRequest, NextResponse } from "next/server";
import { requireAuth, forbidden } from "@/lib/require-auth";
import { db } from "@/db";
import {
  users, meals, progressEntries, workouts, goals,
  recipes, diets, trainingPlans, products, challenges, userChallenges,
} from "@/db/schema";
import { count, gte, sql } from "drizzle-orm";

export const runtime = "nodejs";

async function countTable(table: Parameters<typeof db.select>[0] extends undefined ? never : any) {
  const rows = await db.select({ value: count() }).from(table as any);
  return rows[0]?.value ?? 0;
}

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;
  if (auth.payload.role !== "admin") return forbidden();

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers, totalMeals, totalProgress, totalWorkouts,
      totalGoals, totalRecipes, totalDiets, totalPlans,
      totalProducts, totalChallenges, totalUserChallenges,
    ] = await Promise.all([
      db.select({ value: count() }).from(users).then((r) => r[0]?.value ?? 0),
      db.select({ value: count() }).from(meals).then((r) => r[0]?.value ?? 0),
      db.select({ value: count() }).from(progressEntries).then((r) => r[0]?.value ?? 0),
      db.select({ value: count() }).from(workouts).then((r) => r[0]?.value ?? 0),
      db.select({ value: count() }).from(goals).then((r) => r[0]?.value ?? 0),
      db.select({ value: count() }).from(recipes).then((r) => r[0]?.value ?? 0),
      db.select({ value: count() }).from(diets).then((r) => r[0]?.value ?? 0),
      db.select({ value: count() }).from(trainingPlans).then((r) => r[0]?.value ?? 0),
      db.select({ value: count() }).from(products).then((r) => r[0]?.value ?? 0),
      db.select({ value: count() }).from(challenges).then((r) => r[0]?.value ?? 0),
      db.select({ value: count() }).from(userChallenges).then((r) => r[0]?.value ?? 0),
    ]);

    const newUsersRows = await db
      .select({ value: count() })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo));
    const newUsers30d = newUsersRows[0]?.value ?? 0;

    return NextResponse.json({
      users: { total: totalUsers, new30d: newUsers30d },
      meals: totalMeals,
      progressEntries: totalProgress,
      workouts: totalWorkouts,
      goals: totalGoals,
      content: {
        recipes: totalRecipes,
        diets: totalDiets,
        trainingPlans: totalPlans,
        products: totalProducts,
        challenges: totalChallenges,
        userChallenges: totalUserChallenges,
      },
    });
  } catch (err) {
    console.error("GET /api/admin/stats", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
