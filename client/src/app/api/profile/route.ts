import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/server/require-auth";
import * as repo from "@/src/lib/server/repositories/profile";

export const runtime = "nodejs";

type ActivityLevel = "sedentary" | "light" | "moderate" | "very";
type GoalType = "lose_weight" | "maintain" | "gain_weight";

const ACTIVITY_LEVELS = new Set<ActivityLevel>(["sedentary", "light", "moderate", "very"]);
const GOAL_TYPES = new Set<GoalType>(["lose_weight", "maintain", "gain_weight"]);

function asTrimmedString(value: unknown): string {
  return String(value ?? "").trim();
}

function asNullableNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : Number.NaN;
}

function validateRange(label: string, value: number | null, min: number, max: number): string | null {
  if (value == null) return null;
  if (!Number.isFinite(value)) return `${label} е невалидно число.`;
  if (value < min || value > max) return `${label} трябва да е между ${min} и ${max}.`;
  return null;
}

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const profile = await repo.getByUserId(auth.payload.sub);
    if (!profile) {
      return NextResponse.json({ message: "Профилът не е намерен." }, { status: 404 });
    }
    return NextResponse.json({ profile });
  } catch (err) {
    console.error("GET /api/profile", err);
    return NextResponse.json({ message: "Сървърна грешка." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ message: "Невалидно тяло на заявката." }, { status: 400 });
    }

    const patch: repo.UpdateProfileInput = {};

    if (body.firstName !== undefined) {
      const firstName = asTrimmedString(body.firstName);
      if (!firstName) return NextResponse.json({ message: "Името е задължително." }, { status: 400 });
      patch.firstName = firstName;
    }

    if (body.lastName !== undefined) {
      const lastName = asTrimmedString(body.lastName);
      if (!lastName) return NextResponse.json({ message: "Фамилията е задължителна." }, { status: 400 });
      patch.lastName = lastName;
    }

    if (body.gender !== undefined) {
      const gender = body.gender === "" || body.gender == null ? null : String(body.gender);
      if (gender !== null && gender !== "male" && gender !== "female") {
        return NextResponse.json({ message: "Невалиден пол." }, { status: 400 });
      }
      patch.gender = gender;
    }

    if (body.age !== undefined) {
      const age = asNullableNumber(body.age);
      const ageError = validateRange("Възраст", age, 10, 100);
      if (ageError) return NextResponse.json({ message: ageError }, { status: 400 });
      patch.age = age;
    }

    if (body.heightCm !== undefined) {
      const heightCm = asNullableNumber(body.heightCm);
      const heightError = validateRange("Ръст", heightCm, 100, 250);
      if (heightError) return NextResponse.json({ message: heightError }, { status: 400 });
      patch.heightCm = heightCm;
    }

    if (body.goalWeight !== undefined) {
      const goalWeight = asNullableNumber(body.goalWeight);
      const goalWeightError = validateRange("Целево тегло", goalWeight, 30, 300);
      if (goalWeightError) return NextResponse.json({ message: goalWeightError }, { status: 400 });
      patch.goalWeight = goalWeight;
    }

    if (body.activityLevel !== undefined) {
      const activityLevel = body.activityLevel === "" || body.activityLevel == null ? null : String(body.activityLevel);
      if (activityLevel !== null && !ACTIVITY_LEVELS.has(activityLevel as ActivityLevel)) {
        return NextResponse.json({ message: "Невалидно ниво на активност." }, { status: 400 });
      }
      patch.activityLevel = activityLevel as ActivityLevel | null;
    }

    if (body.goalType !== undefined) {
      const goalType = body.goalType === "" || body.goalType == null ? null : String(body.goalType);
      if (goalType !== null && !GOAL_TYPES.has(goalType as GoalType)) {
        return NextResponse.json({ message: "Невалидна цел." }, { status: 400 });
      }
      patch.goalType = goalType as GoalType | null;
    }

    if (body.caloriesTarget !== undefined) {
      const caloriesTarget = asNullableNumber(body.caloriesTarget);
      if (caloriesTarget != null && caloriesTarget < 0) {
        return NextResponse.json({ message: "Калорийният таргет не може да е отрицателен." }, { status: 400 });
      }
      patch.caloriesTarget = caloriesTarget == null ? null : Math.round(caloriesTarget);
    }

    if (body.proteinTarget !== undefined) {
      const proteinTarget = asNullableNumber(body.proteinTarget);
      if (proteinTarget != null && proteinTarget < 0) {
        return NextResponse.json({ message: "Протеинът не може да е отрицателен." }, { status: 400 });
      }
      patch.proteinTarget = proteinTarget;
    }

    if (body.carbsTarget !== undefined) {
      const carbsTarget = asNullableNumber(body.carbsTarget);
      if (carbsTarget != null && carbsTarget < 0) {
        return NextResponse.json({ message: "Въглехидратите не могат да са отрицателни." }, { status: 400 });
      }
      patch.carbsTarget = carbsTarget;
    }

    if (body.fatTarget !== undefined) {
      const fatTarget = asNullableNumber(body.fatTarget);
      if (fatTarget != null && fatTarget < 0) {
        return NextResponse.json({ message: "Мазнините не могат да са отрицателни." }, { status: 400 });
      }
      patch.fatTarget = fatTarget;
    }

    const profile = await repo.updateByUserId(auth.payload.sub, patch);
    if (!profile) {
      return NextResponse.json({ message: "Профилът не е намерен." }, { status: 404 });
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/profile", err);
    return NextResponse.json({ message: "Сървърна грешка." }, { status: 500 });
  }
}
