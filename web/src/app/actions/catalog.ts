"use server";

import * as recipesRepo from "@/src/lib/server/repositories/recipes";
import * as productsRepo from "@/src/lib/server/repositories/products";
import * as dietsRepo from "@/src/lib/server/repositories/diets";
import * as trainingPlansRepo from "@/src/lib/server/repositories/training-plans";
import * as challengesRepo from "@/src/lib/server/repositories/challenges";

// ─── Recipes ────────────────────────────────────────────────────────────────

export type RecipesFilter = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  difficulty?: string;
};

/** Server Action: fetch paginated recipes catalog. */
export async function getRecipesAction(filter: RecipesFilter = {}) {
  return recipesRepo.list({
    page: filter.page ?? 1,
    limit: filter.limit ?? 20,
    search: filter.search,
    category: filter.category,
    difficulty: filter.difficulty,
  });
}

/** Server Action: fetch a single recipe by ID. */
export async function getRecipeByIdAction(id: string) {
  return recipesRepo.findById(id);
}

// ─── Products ───────────────────────────────────────────────────────────────

export type ProductsFilter = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
};

/** Server Action: fetch paginated nutrition products catalog. */
export async function getProductsAction(filter: ProductsFilter = {}) {
  return productsRepo.list({
    page: filter.page ?? 1,
    limit: filter.limit ?? 20,
    search: filter.search,
    category: filter.category,
  });
}

/** Server Action: fetch a single product by ID. */
export async function getProductByIdAction(id: string) {
  return productsRepo.findById(id);
}

// ─── Diets ──────────────────────────────────────────────────────────────────

export type DietsFilter = {
  page?: number;
  limit?: number;
  search?: string;
};

/** Server Action: fetch paginated diets catalog. */
export async function getDietsAction(filter: DietsFilter = {}) {
  return dietsRepo.list({
    page: filter.page ?? 1,
    limit: filter.limit ?? 20,
    search: filter.search,
  });
}

/** Server Action: fetch a single diet by ID. */
export async function getDietByIdAction(id: string) {
  return dietsRepo.findById(id);
}

// ─── Training Plans ─────────────────────────────────────────────────────────

export type TrainingPlansFilter = {
  page?: number;
  limit?: number;
  search?: string;
  goalType?: string;
  level?: string;
};

/** Server Action: fetch paginated training plans catalog. */
export async function getTrainingPlansAction(filter: TrainingPlansFilter = {}) {
  return trainingPlansRepo.list({
    page: filter.page ?? 1,
    limit: filter.limit ?? 20,
    search: filter.search,
    goalType: filter.goalType,
    level: filter.level,
  });
}

/** Server Action: fetch a single training plan by ID. */
export async function getTrainingPlanByIdAction(id: string) {
  return trainingPlansRepo.findById(id);
}

// ─── Challenges ─────────────────────────────────────────────────────────────

/** Server Action: fetch paginated challenges catalog. */
export async function getChallengesAction(page = 1, limit = 20) {
  return challengesRepo.list({ page, limit });
}

/** Server Action: fetch a single challenge by ID. */
export async function getChallengeByIdAction(id: string) {
  return challengesRepo.findById(id);
}
