import { NextResponse } from "next/server";
import type { DietInput, UpdateDietInput } from "./repositories/diets";

const CATEGORIES = new Set(["balanced", "high-protein", "low-carb", "calorie-deficit", "vegetarian", "muscle-gain", "heart-healthy"]);
const GOALS = new Set(["lose_weight", "maintain_weight", "gain_weight", "health"]);
const DIFFICULTIES = new Set(["easy", "medium", "hard"]);

function badRequest(message: string): NextResponse {
  return NextResponse.json({ message }, { status: 400 });
}

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const items = value.map((item) => String(item).trim()).filter(Boolean);
  return items.length ? items : null;
}

function validGoal(value: string): value is DietInput["goalType"] {
  return GOALS.has(value);
}

export function parseDietCreate(body: Record<string, unknown> | null): DietInput | NextResponse {
  if (!body) return badRequest("Invalid request body.");
  const rules = asStringArray(body.rules);
  const sampleMenu = asStringArray(body.sampleMenu);
  const suitableFor = asStringArray(body.suitableFor);
  const notSuitableFor = asStringArray(body.notSuitableFor);

  if (!body.title || !body.description || !body.category || !body.goalType || !body.difficulty || !rules || !sampleMenu || !suitableFor || !notSuitableFor) {
    return badRequest("Missing required diet fields.");
  }

  const category = String(body.category);
  const goalType = String(body.goalType);
  const difficulty = String(body.difficulty);
  if (!CATEGORIES.has(category)) return badRequest("Invalid category.");
  if (!validGoal(goalType)) return badRequest("Invalid goalType.");
  if (!DIFFICULTIES.has(difficulty)) return badRequest("Invalid difficulty.");

  return {
    title: String(body.title).trim(),
    description: String(body.description).trim(),
    category,
    goalType,
    durationDays: Number(body.durationDays),
    difficulty,
    caloriesPerDay: Number(body.caloriesPerDay),
    proteinTarget: Number(body.proteinTarget),
    carbsTarget: Number(body.carbsTarget),
    fatTarget: Number(body.fatTarget),
    rules,
    sampleMenu,
    suitableFor,
    notSuitableFor,
  };
}

export function parseDietPatch(body: Record<string, unknown> | null): UpdateDietInput | NextResponse {
  if (!body) return badRequest("Invalid request body.");
  const patch: UpdateDietInput = {};

  if (body.title !== undefined) patch.title = String(body.title).trim();
  if (body.description !== undefined) patch.description = String(body.description).trim();
  if (body.category !== undefined) {
    const category = String(body.category);
    if (!CATEGORIES.has(category)) return badRequest("Invalid category.");
    patch.category = category;
  }
  if (body.goalType !== undefined) {
    const goalType = String(body.goalType);
    if (!validGoal(goalType)) return badRequest("Invalid goalType.");
    patch.goalType = goalType;
  }
  if (body.difficulty !== undefined) {
    const difficulty = String(body.difficulty);
    if (!DIFFICULTIES.has(difficulty)) return badRequest("Invalid difficulty.");
    patch.difficulty = difficulty;
  }
  if (body.durationDays !== undefined) patch.durationDays = Number(body.durationDays);
  if (body.caloriesPerDay !== undefined) patch.caloriesPerDay = Number(body.caloriesPerDay);
  if (body.proteinTarget !== undefined) patch.proteinTarget = Number(body.proteinTarget);
  if (body.carbsTarget !== undefined) patch.carbsTarget = Number(body.carbsTarget);
  if (body.fatTarget !== undefined) patch.fatTarget = Number(body.fatTarget);
  if (body.rules !== undefined) {
    const rules = asStringArray(body.rules);
    if (!rules) return badRequest("rules must be a non-empty array.");
    patch.rules = rules;
  }
  if (body.sampleMenu !== undefined) {
    const sampleMenu = asStringArray(body.sampleMenu);
    if (!sampleMenu) return badRequest("sampleMenu must be a non-empty array.");
    patch.sampleMenu = sampleMenu;
  }
  if (body.suitableFor !== undefined) {
    const suitableFor = asStringArray(body.suitableFor);
    if (!suitableFor) return badRequest("suitableFor must be a non-empty array.");
    patch.suitableFor = suitableFor;
  }
  if (body.notSuitableFor !== undefined) {
    const notSuitableFor = asStringArray(body.notSuitableFor);
    if (!notSuitableFor) return badRequest("notSuitableFor must be a non-empty array.");
    patch.notSuitableFor = notSuitableFor;
  }

  return patch;
}
