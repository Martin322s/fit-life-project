import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set in .env.local");

const db = drizzle(neon(url), { schema });

const TITLES: Record<string, string[]> = {
  balanced: [
    "Балансиран старт 14 дни",
    "Средиземноморски баланс",
    "Гъвкав план 80/20",
    "Семеен балансиран режим",
    "Работен ден без хаос",
  ],
  "high-protein": [
    "Високопротеинов дефицит",
    "Протеинов план за ситост",
    "Пилешко и риба ротация",
    "Скир и чист протеин",
    "Активен протеинов режим",
  ],
  "low-carb": [
    "Умерено нисковъглехидратен план",
    "Low-carb вечерен контрол",
    "Нисковъглехидратен старт",
    "Зеленчуци и протеин",
    "Контрол на апетита low-carb",
  ],
  "calorie-deficit": [
    "Дефицит 500 kcal",
    "Плавно отслабване 8 седмици",
    "Лек дефицит за начинаещи",
    "Структуриран дефицит 30 дни",
    "Плато рестарт",
  ],
  vegetarian: [
    "Вегетариански баланс",
    "Нахут, леща и киноа",
    "Високофибрен veggie план",
    "Лакто-ово режим",
    "Растителен лек дефицит",
  ],
  "muscle-gain": [
    "Чист мускулен растеж",
    "Lean bulk 12 седмици",
    "Сила и възстановяване",
    "Високи калории с контрол",
    "Тренировъчен surplus",
  ],
  "heart-healthy": [
    "Сърдечно здраве 30 дни",
    "DASH вдъхновен план",
    "Омега-3 средиземноморски режим",
    "Нисък натрий и фибри",
    "Холестерол контрол",
  ],
};

const META: Record<string, { goalType: "lose_weight" | "maintain_weight" | "gain_weight" | "health"; calories: number; protein: number; carbs: number; fat: number; duration: number; difficulty: "easy" | "medium" | "hard" }> = {
  balanced: { goalType: "maintain_weight", calories: 2100, protein: 130, carbs: 240, fat: 70, duration: 30, difficulty: "easy" },
  "high-protein": { goalType: "lose_weight", calories: 1900, protein: 165, carbs: 150, fat: 65, duration: 42, difficulty: "medium" },
  "low-carb": { goalType: "lose_weight", calories: 1800, protein: 145, carbs: 95, fat: 85, duration: 28, difficulty: "medium" },
  "calorie-deficit": { goalType: "lose_weight", calories: 1750, protein: 140, carbs: 170, fat: 55, duration: 56, difficulty: "easy" },
  vegetarian: { goalType: "health", calories: 2000, protein: 105, carbs: 260, fat: 65, duration: 30, difficulty: "medium" },
  "muscle-gain": { goalType: "gain_weight", calories: 2750, protein: 180, carbs: 330, fat: 80, duration: 84, difficulty: "medium" },
  "heart-healthy": { goalType: "health", calories: 2050, protein: 120, carbs: 250, fat: 65, duration: 60, difficulty: "easy" },
};

function rules(category: string): string[] {
  const base = ["Планирай 3 основни хранения и 1-2 малки междинни хранения.", "Пий вода редовно през деня.", "Следи порциите и записвай отклоненията честно."];
  if (category === "low-carb") return ["Дръж въглехидратите основно около тренировка.", "Избирай зеленчуци с ниска скорбяла.", ...base.slice(1)];
  if (category === "muscle-gain") return ["Добави 250-350 kcal над поддръжка.", "Приемай протеин във всяко хранене.", "Не пропускай въглехидрати след тренировка."];
  if (category === "heart-healthy") return ["Ограничи солта и преработените храни.", "Яж риба или растителни омега-3 източници.", "Избирай пълнозърнести и бобови храни."];
  return base;
}

function menu(category: string): string[] {
  if (category === "vegetarian") return ["Закуска: овес с кисело мляко и плод", "Обяд: леща с салата", "Снак: скир или ядки", "Вечеря: киноа с нахут и зеленчуци"];
  if (category === "muscle-gain") return ["Закуска: яйца, овес и банан", "Обяд: пилешко с ориз", "Снак: скир с мед", "Вечеря: телешко с картофи"];
  if (category === "low-carb") return ["Закуска: омлет със зеленчуци", "Обяд: салата с пилешко", "Снак: извара с краставица", "Вечеря: риба с броколи"];
  return ["Закуска: протеинова закуска с плод", "Обяд: чист протеин с гарнитура", "Снак: кисело мляко или плод", "Вечеря: зеленчуци с протеин"];
}

const diets = Object.entries(TITLES).flatMap(([category, titles]) => {
  const meta = META[category];
  return titles.map((title, index) => ({
    title,
    description: `Практичен хранителен план за ${title.toLowerCase()} с ясни дневни цели, примерни хранения и лесни правила за следване.`,
    category,
    goalType: meta.goalType,
    durationDays: meta.duration + (index % 3) * 7,
    difficulty: index % 5 === 4 ? "hard" : meta.difficulty,
    caloriesPerDay: meta.calories + (index % 3) * 100 - (index % 2) * 50,
    proteinTarget: meta.protein + (index % 3) * 5,
    carbsTarget: meta.carbs + (index % 4) * 10,
    fatTarget: meta.fat + (index % 2) * 5,
    rules: rules(category),
    sampleMenu: menu(category),
    suitableFor: ["хора, които искат структуриран режим", "потребители, които могат да планират храненията си", "начинаещи и средно напреднали"],
    notSuitableFor: ["бременни без лекарска консултация", "хора с медицински ограничения без специалист", "потребители с хранителни разстройства"],
  }));
});

async function seedDiets() {
  console.log(`Seeding ${diets.length} diets...`);

  for (const diet of diets) {
    const exists = await db
      .select({ id: schema.diets.id })
      .from(schema.diets)
      .where(sql`lower(${schema.diets.title}) = ${diet.title.toLowerCase()}`)
      .limit(1);

    if (exists.length > 0) {
      console.log(`  skipped ${diet.title}`);
      continue;
    }

    await db.insert(schema.diets).values(diet);
    console.log(`  created ${diet.title}`);
  }

  console.log("Diet seed done.");
  process.exit(0);
}

seedDiets().catch((err) => {
  console.error(err);
  process.exit(1);
});
