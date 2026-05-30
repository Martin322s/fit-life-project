import { NextResponse } from "next/server";
import type { ProductInput, UpdateProductInput } from "./repositories/products";

const CATEGORIES = new Set(["meat", "fish", "eggs", "dairy", "grains", "bread", "pasta", "rice", "legumes", "vegetables", "fruits", "nuts", "seeds", "oils", "sweets", "snacks", "drinks", "sauces", "ready meals", "supplements"]);

function badRequest(message: string): NextResponse {
  return NextResponse.json({ message }, { status: 400 });
}

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const items = value.map((item) => String(item).trim()).filter(Boolean);
  return items.length ? items : null;
}

function asNullableString(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  return String(value).trim();
}

function asNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  return Number(value);
}

function applyCommon(body: Record<string, unknown>, target: UpdateProductInput): NextResponse | null {
  if (body.name !== undefined) target.name = String(body.name).trim();
  if (body.description !== undefined) target.description = String(body.description).trim();
  if (body.category !== undefined) {
    const category = String(body.category);
    if (!CATEGORIES.has(category)) return badRequest("Invalid category.");
    target.category = category;
  }
  if (body.brand !== undefined) target.brand = asNullableString(body.brand);
  if (body.servingSize !== undefined) target.servingSize = Number(body.servingSize);
  if (body.servingUnit !== undefined) target.servingUnit = String(body.servingUnit).trim();
  if (body.calories !== undefined) target.calories = Number(body.calories);
  if (body.protein !== undefined) target.protein = Number(body.protein);
  if (body.carbs !== undefined) target.carbs = Number(body.carbs);
  if (body.fat !== undefined) target.fat = Number(body.fat);
  if (body.sugar !== undefined) target.sugar = asNullableNumber(body.sugar);
  if (body.fiber !== undefined) target.fiber = asNullableNumber(body.fiber);
  if (body.salt !== undefined) target.salt = asNullableNumber(body.salt);
  if (body.barcode !== undefined) target.barcode = asNullableString(body.barcode);
  if (body.imageUrl !== undefined) target.imageUrl = asNullableString(body.imageUrl);
  if (body.tags !== undefined) {
    const tags = asStringArray(body.tags);
    if (!tags) return badRequest("tags must be a non-empty array.");
    target.tags = tags;
  }
  return null;
}

export function parseProductCreate(body: Record<string, unknown> | null): ProductInput | NextResponse {
  if (!body) return badRequest("Invalid request body.");
  const tags = asStringArray(body.tags);
  if (!body.name || !body.description || !body.category || !body.servingSize || !body.servingUnit || body.calories === undefined || body.protein === undefined || body.carbs === undefined || body.fat === undefined || !tags) {
    return badRequest("Missing required product fields.");
  }

  const category = String(body.category);
  if (!CATEGORIES.has(category)) return badRequest("Invalid category.");

  return {
    name: String(body.name).trim(),
    description: String(body.description).trim(),
    category,
    brand: asNullableString(body.brand),
    servingSize: Number(body.servingSize),
    servingUnit: String(body.servingUnit).trim(),
    calories: Number(body.calories),
    protein: Number(body.protein),
    carbs: Number(body.carbs),
    fat: Number(body.fat),
    sugar: asNullableNumber(body.sugar),
    fiber: asNullableNumber(body.fiber),
    salt: asNullableNumber(body.salt),
    barcode: asNullableString(body.barcode),
    imageUrl: asNullableString(body.imageUrl),
    tags,
  };
}

export function parseProductPatch(body: Record<string, unknown> | null): UpdateProductInput | NextResponse {
  if (!body) return badRequest("Invalid request body.");
  const patch: UpdateProductInput = {};
  const error = applyCommon(body, patch);
  return error ?? patch;
}
