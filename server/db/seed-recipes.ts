import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set in .env.local");

const db = drizzle(neon(url), { schema });

const CATEGORY_TITLES: Record<string, string[]> = {
  breakfast: [
    "Овесени ядки с кисело мляко и горски плодове",
    "Протеинови палачинки с банан",
    "Омлет със спанак и сирене",
    "Чиа пудинг с ябълка и канела",
    "Пълнозърнест тост с авокадо и яйце",
    "Смути купа с скир и плодове",
    "Кисело мляко с орехи и мед",
    "Елда с извара и домати",
  ],
  lunch: [
    "Пилешка купа с ориз и зеленчуци",
    "Пуешки кюфтета с картофи",
    "Телешко с булгур и салата",
    "Салата с риба тон и боб",
    "Пълнозърнеста паста с пилешко",
    "Киноа с печени зеленчуци и сирене",
    "Свинско филе със зелен фасул",
    "Оризови нудли със скариди",
  ],
  dinner: [
    "Сьомга с броколи и лимон",
    "Пилешко филе с тиквички",
    "Пълнени чушки с пуешка кайма",
    "Запечена треска със салата",
    "Телешки стек със зеленчуци",
    "Яйца по шакшука с салата",
    "Пилешка супа с фиде",
    "Печени кюфтенца с карфиол",
  ],
  snack: [
    "Протеинов крем с какао",
    "Оризовки с фъстъчено масло",
    "Извара с краставица и копър",
    "Ябълка с тахан",
    "Мини сандвич с пуешко",
    "Моркови с хумус",
    "Скир с малини",
    "Домашен протеинов бар",
  ],
  "high-protein": [
    "Пилешко с извара и салата",
    "Скир купа с протеин и ягоди",
    "Телешки бургер без питка",
    "Туна микс с яйца",
    "Пуешко чили с боб",
    "Протеинова овесена каша",
    "Скариди с киноа",
    "Омлет с пуешко и гъби",
  ],
  "low-calorie": [
    "Салата с пилешко и лайм",
    "Крем супа от тиквички",
    "Треска с краставична салата",
    "Зеленчуково рагу с нахут",
    "Пилешки шишчета със салата",
    "Карфиолен ориз с яйце",
    "Салата капрезе light",
    "Пълнени тиквички с извара",
  ],
  vegetarian: [
    "Киноа с нахут и таханов сос",
    "Леща яхния със зеленчуци",
    "Паста с домати и моцарела",
    "Тофу с ориз и броколи",
    "Бобена салата с печени чушки",
    "Зеленчуково къри с кокосово мляко",
    "Омлет със сирене и домати",
    "Пълнозърнест wrap с хумус",
  ],
};

const CATEGORY_META: Record<string, { calories: number; protein: number; carbs: number; fat: number; prep: number; difficulty: "easy" | "medium" | "hard" }> = {
  breakfast: { calories: 380, protein: 24, carbs: 42, fat: 12, prep: 12, difficulty: "easy" },
  lunch: { calories: 560, protein: 42, carbs: 55, fat: 18, prep: 30, difficulty: "medium" },
  dinner: { calories: 490, protein: 44, carbs: 28, fat: 20, prep: 28, difficulty: "medium" },
  snack: { calories: 210, protein: 18, carbs: 20, fat: 7, prep: 8, difficulty: "easy" },
  "high-protein": { calories: 430, protein: 48, carbs: 24, fat: 14, prep: 22, difficulty: "medium" },
  "low-calorie": { calories: 290, protein: 30, carbs: 22, fat: 9, prep: 20, difficulty: "easy" },
  vegetarian: { calories: 420, protein: 22, carbs: 52, fat: 14, prep: 25, difficulty: "medium" },
};

function ingredientsFor(category: string, title: string): string[] {
  if (category === "breakfast") return ["основен продукт според рецептата", "кисело мляко или яйца", "плод или зеленчук", "канела, сол и черен пипер"];
  if (category === "snack") return ["протеинов източник", "плод или зеленчук", "ядки или тахан", "щипка канела или копър"];
  if (category === "vegetarian") return ["бобова или зърнена основа", "сезонни зеленчуци", "сирене, тофу или нахут", "зехтин и подправки"];
  if (title.toLowerCase().includes("риба") || title.toLowerCase().includes("сьомга") || title.toLowerCase().includes("треска")) return ["риба филе", "зеленчуци", "лимон", "зехтин, сол и пипер"];
  return ["чист протеин", "зеленчуци", "ориз, картофи или булгур", "зехтин и подправки"];
}

function instructionsFor(category: string): string[] {
  if (category === "breakfast" || category === "snack") {
    return ["Подготви продуктите и ги нарежи при нужда.", "Смеси основните съставки в купа.", "Овкуси и сервирай веднага или охлади за кратко."];
  }
  return ["Подготви продуктите и загрей тиган или фурна.", "Сготви протеина до готовност и добави зеленчуците.", "Добави гарнитурата, овкуси и сервирай топло."];
}

const recipes = Object.entries(CATEGORY_TITLES).flatMap(([category, titles]) => {
  const meta = CATEGORY_META[category];
  return titles.map((title, index) => ({
    title,
    description: `Балансирана рецепта за ${title.toLowerCase()} с ясни макроси и лесно планиране.`,
    category,
    imageUrl: null,
    calories: meta.calories + (index % 4) * 25 - (index % 2) * 15,
    protein: meta.protein + (index % 3) * 2,
    carbs: meta.carbs + (index % 4) * 3,
    fat: meta.fat + (index % 3),
    prepMinutes: meta.prep + (index % 4) * 3,
    difficulty: index % 7 === 6 ? "hard" : meta.difficulty,
    ingredients: ingredientsFor(category, title),
    instructions: instructionsFor(category),
  }));
});

async function seedRecipes() {
  console.log(`Seeding ${recipes.length} recipes...`);

  for (const recipe of recipes) {
    const exists = await db
      .select({ id: schema.recipes.id })
      .from(schema.recipes)
      .where(sql`lower(${schema.recipes.title}) = ${recipe.title.toLowerCase()}`)
      .limit(1);

    if (exists.length > 0) {
      console.log(`  skipped ${recipe.title}`);
      continue;
    }

    await db.insert(schema.recipes).values(recipe);
    console.log(`  created ${recipe.title}`);
  }

  console.log("Recipe seed done.");
  process.exit(0);
}

seedRecipes().catch((err) => {
  console.error(err);
  process.exit(1);
});
