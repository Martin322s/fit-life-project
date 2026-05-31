import { NextResponse } from "next/server";
import type { ChallengeTargetType } from "@/src/db/schema";
import type { ChallengeInput, UpdateChallengeInput } from "./repositories/challenges";

const CATEGORIES = new Set(["fitness", "nutrition", "hydration", "weight loss", "habits", "beginner", "consistency"]);
const DIFFICULTIES = new Set(["easy", "medium", "hard"]);
const TARGET_TYPES = new Set<ChallengeTargetType>([
  "steps",
  "workouts",
  "weight_loss",
  "calories_burned",
  "water",
  "consistency",
  "custom",
]);

function badRequest(message: string): NextResponse {
  return NextResponse.json({ message }, { status: 400 });
}

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const items = value.map((item) => String(item).trim()).filter(Boolean);
  return items.length ? items : null;
}

export function parseChallengeCreate(body: Record<string, unknown> | null): ChallengeInput | NextResponse {
  if (!body) return badRequest("Invalid request body.");

  const rules = asStringArray(body.rules);
  if (!body.title || !body.description || !body.category || !body.difficulty || !body.targetType || !body.targetUnit || !rules) {
    return badRequest("title, description, category, difficulty, targetType, targetUnit and rules are required.");
  }

  const category = String(body.category);
  const difficulty = String(body.difficulty);
  const targetType = String(body.targetType) as ChallengeTargetType;

  if (!CATEGORIES.has(category)) return badRequest("Invalid category.");
  if (!DIFFICULTIES.has(difficulty)) return badRequest("Invalid difficulty.");
  if (!TARGET_TYPES.has(targetType)) return badRequest("Invalid targetType.");

  return {
    title: String(body.title).trim(),
    description: String(body.description).trim(),
    category,
    difficulty,
    durationDays: Number(body.durationDays),
    targetType,
    targetValue: Number(body.targetValue),
    targetUnit: String(body.targetUnit).trim(),
    rewardText: body.rewardText ? String(body.rewardText).trim() : null,
    rules,
    imageUrl: body.imageUrl ? String(body.imageUrl) : null,
  };
}

export function parseChallengePatch(body: Record<string, unknown> | null): UpdateChallengeInput | NextResponse {
  if (!body) return badRequest("Invalid request body.");

  const patch: UpdateChallengeInput = {};

  if (body.title !== undefined) patch.title = String(body.title).trim();
  if (body.description !== undefined) patch.description = String(body.description).trim();

  if (body.category !== undefined) {
    const category = String(body.category);
    if (!CATEGORIES.has(category)) return badRequest("Invalid category.");
    patch.category = category;
  }

  if (body.difficulty !== undefined) {
    const difficulty = String(body.difficulty);
    if (!DIFFICULTIES.has(difficulty)) return badRequest("Invalid difficulty.");
    patch.difficulty = difficulty;
  }

  if (body.durationDays !== undefined) patch.durationDays = Number(body.durationDays);

  if (body.targetType !== undefined) {
    const targetType = String(body.targetType) as ChallengeTargetType;
    if (!TARGET_TYPES.has(targetType)) return badRequest("Invalid targetType.");
    patch.targetType = targetType;
  }

  if (body.targetValue !== undefined) patch.targetValue = Number(body.targetValue);
  if (body.targetUnit !== undefined) patch.targetUnit = String(body.targetUnit).trim();

  if (body.rewardText !== undefined) patch.rewardText = body.rewardText ? String(body.rewardText).trim() : null;
  if (body.imageUrl !== undefined) patch.imageUrl = body.imageUrl ? String(body.imageUrl) : null;

  if (body.rules !== undefined) {
    const rules = asStringArray(body.rules);
    if (!rules) return badRequest("rules must be a non-empty array.");
    patch.rules = rules;
  }

  return patch;
}
