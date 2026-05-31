import { NextResponse } from "next/server";
import type { RecipeInput, UpdateRecipeInput } from "./repositories/recipes";

const CATEGORIES = new Set(["breakfast", "lunch", "dinner", "snack", "high-protein", "low-calorie", "vegetarian"]);
const DIFFICULTIES = new Set(["easy", "medium", "hard"]);

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const items = value.map((item) => String(item).trim()).filter(Boolean);
  return items.length ? items : null;
}

function badRequest(message: string): NextResponse {
  return NextResponse.json({ message }, { status: 400 });
}

export function parseRecipeCreate(body: Record<string, unknown> | null): RecipeInput | NextResponse {
  if (!body) return badRequest("Invalid request body.");
  const ingredients = asStringArray(body.ingredients);
  const instructions = asStringArray(body.instructions);

  if (!body.title || !body.description || !body.category || !body.difficulty || !ingredients || !instructions) {
    return badRequest("title, description, category, difficulty, ingredients and instructions are required.");
  }

  const category = String(body.category);
  const difficulty = String(body.difficulty);
  if (!CATEGORIES.has(category)) return badRequest("Invalid category.");
  if (!DIFFICULTIES.has(difficulty)) return badRequest("Invalid difficulty.");

  return {
    title: String(body.title).trim(),
    description: String(body.description).trim(),
    category,
    imageUrl: body.imageUrl ? String(body.imageUrl) : null,
    calories: Number(body.calories),
    protein: Number(body.protein),
    carbs: Number(body.carbs),
    fat: Number(body.fat),
    prepMinutes: Number(body.prepMinutes),
    difficulty,
    ingredients,
    instructions,
  };
}

export function parseRecipePatch(body: Record<string, unknown> | null): UpdateRecipeInput | NextResponse {
  if (!body) return badRequest("Invalid request body.");
  const patch: UpdateRecipeInput = {};

  if (body.title !== undefined) patch.title = String(body.title).trim();
  if (body.description !== undefined) patch.description = String(body.description).trim();
  if (body.category !== undefined) {
    const category = String(body.category);
    if (!CATEGORIES.has(category)) return badRequest("Invalid category.");
    patch.category = category;
  }
  if (body.imageUrl !== undefined) patch.imageUrl = body.imageUrl ? String(body.imageUrl) : null;
  if (body.calories !== undefined) patch.calories = Number(body.calories);
  if (body.protein !== undefined) patch.protein = Number(body.protein);
  if (body.carbs !== undefined) patch.carbs = Number(body.carbs);
  if (body.fat !== undefined) patch.fat = Number(body.fat);
  if (body.prepMinutes !== undefined) patch.prepMinutes = Number(body.prepMinutes);
  if (body.difficulty !== undefined) {
    const difficulty = String(body.difficulty);
    if (!DIFFICULTIES.has(difficulty)) return badRequest("Invalid difficulty.");
    patch.difficulty = difficulty;
  }
  if (body.ingredients !== undefined) {
    const ingredients = asStringArray(body.ingredients);
    if (!ingredients) return badRequest("ingredients must be a non-empty array.");
    patch.ingredients = ingredients;
  }
  if (body.instructions !== undefined) {
    const instructions = asStringArray(body.instructions);
    if (!instructions) return badRequest("instructions must be a non-empty array.");
    patch.instructions = instructions;
  }

  return patch;
}
