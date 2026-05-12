import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

const TARGET_ROWS_PER_TABLE = 10_000;

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set in .env.local");

const sql = neon(url);

type CountRow = {
  count: number | string;
};

async function ensureCatalogIndexes(): Promise<void> {
  const statements = [
    "CREATE EXTENSION IF NOT EXISTS pg_trgm",
    "CREATE INDEX IF NOT EXISTS recipes_catalog_list_idx ON recipes (category, difficulty, created_at DESC)",
    "CREATE INDEX IF NOT EXISTS recipes_lower_title_idx ON recipes (lower(title))",
    "CREATE INDEX IF NOT EXISTS recipes_title_trgm_idx ON recipes USING gin (title gin_trgm_ops)",
    "CREATE INDEX IF NOT EXISTS recipes_description_trgm_idx ON recipes USING gin (description gin_trgm_ops)",
    "CREATE INDEX IF NOT EXISTS products_catalog_list_idx ON products (category, created_at DESC)",
    "CREATE INDEX IF NOT EXISTS products_nutrition_filter_idx ON products (category, protein DESC, calories, carbs)",
    "CREATE INDEX IF NOT EXISTS products_lower_name_idx ON products (lower(name))",
    "CREATE INDEX IF NOT EXISTS products_name_trgm_idx ON products USING gin (name gin_trgm_ops)",
    "CREATE INDEX IF NOT EXISTS products_description_trgm_idx ON products USING gin (description gin_trgm_ops)",
    "CREATE INDEX IF NOT EXISTS products_brand_trgm_idx ON products USING gin (brand gin_trgm_ops)",
    "CREATE INDEX IF NOT EXISTS products_barcode_trgm_idx ON products USING gin (barcode gin_trgm_ops)",
    "CREATE INDEX IF NOT EXISTS training_plans_goal_level_idx ON training_plans (goal_type, level, created_at DESC)",
    "CREATE INDEX IF NOT EXISTS training_plans_level_created_idx ON training_plans (level, created_at DESC)",
    "CREATE INDEX IF NOT EXISTS training_plans_lower_title_idx ON training_plans (lower(title))",
    "CREATE INDEX IF NOT EXISTS training_plans_title_trgm_idx ON training_plans USING gin (title gin_trgm_ops)",
    "CREATE INDEX IF NOT EXISTS training_plans_description_trgm_idx ON training_plans USING gin (description gin_trgm_ops)",
    "CREATE INDEX IF NOT EXISTS training_plans_equipment_gin_idx ON training_plans USING gin (equipment)",
  ];

  for (const statement of statements) {
    await sql.query(statement, []);
  }

  console.log("Catalog performance indexes are ready.");
}

async function countRows(tableName: "recipes" | "products" | "training_plans"): Promise<number> {
  const result = (await sql.query(`select count(*)::int as count from ${tableName}`, [])) as CountRow[];
  const row = result[0];
  return Number(row?.count ?? 0);
}

async function seedRecipes(): Promise<void> {
  const before = await countRows("recipes");
  const missing = Math.max(TARGET_ROWS_PER_TABLE - before, 0);
  if (missing === 0) {
    console.log(`recipes already has ${before} rows; skipping.`);
    return;
  }

  const batchToken = `load-${Date.now()}`;

  await sql.query(
    `
    with source as (
      select
        gs,
        (array['breakfast', 'lunch', 'dinner', 'snack', 'high-protein', 'low-calorie', 'vegetarian'])[1 + floor(random() * 7)::int] as category,
        (array['easy', 'medium', 'hard'])[1 + floor(random() * 3)::int] as difficulty
      from generate_series(1, $1::int) as gs
    )
    insert into recipes (
      title,
      description,
      category,
      image_url,
      calories,
      protein,
      carbs,
      fat,
      prep_minutes,
      difficulty,
      ingredients,
      instructions
    )
    select
      'Тестова рецепта ' || $2::text || '-' || gs,
      'Автоматично генерирана рецепта за performance тестове с реалистични хранителни стойности.',
      category,
      null,
      180 + floor(random() * 620)::int,
      round((8 + random() * 55)::numeric, 1)::real,
      round((5 + random() * 90)::numeric, 1)::real,
      round((2 + random() * 35)::numeric, 1)::real,
      5 + floor(random() * 70)::int,
      difficulty,
      jsonb_build_array('основен протеин', 'сезонни зеленчуци', 'сложни въглехидрати', 'подправки'),
      jsonb_build_array('Подготви продуктите.', 'Сготви основните съставки.', 'Овкуси и сервирай.')
    from source
    `,
    [missing, batchToken],
  );

  const after = await countRows("recipes");
  console.log(`recipes seeded: ${before} -> ${after}`);
}

async function seedProducts(): Promise<void> {
  const before = await countRows("products");
  const missing = Math.max(TARGET_ROWS_PER_TABLE - before, 0);
  if (missing === 0) {
    console.log(`products already has ${before} rows; skipping.`);
    return;
  }

  const batchToken = `load-${Date.now()}`;

  await sql.query(
    `
    with source as (
      select
        gs,
        (array['meat', 'fish', 'dairy', 'grains', 'vegetables', 'fruits', 'nuts', 'snacks', 'drinks', 'supplements'])[1 + floor(random() * 10)::int] as category,
        (array['FitLife Select', 'Bio Market', 'Protein Lab', 'Daily Fresh', 'Active Foods'])[1 + floor(random() * 5)::int] as brand
      from generate_series(1, $1::int) as gs
    )
    insert into products (
      name,
      description,
      category,
      brand,
      serving_size,
      serving_unit,
      calories,
      protein,
      carbs,
      fat,
      sugar,
      fiber,
      salt,
      barcode,
      image_url,
      tags
    )
    select
      'Тестов продукт ' || $2::text || '-' || gs,
      'Автоматично генериран хранителен продукт за performance тестове и търсене в каталога.',
      category,
      brand,
      case when category = 'drinks' then 330 else 100 end,
      case when category = 'drinks' then 'ml' else 'g' end,
      floor(random() * 750)::int,
      round((random() * 55)::numeric, 1)::real,
      round((random() * 95)::numeric, 1)::real,
      round((random() * 45)::numeric, 1)::real,
      round((random() * 35)::numeric, 1)::real,
      round((random() * 18)::numeric, 1)::real,
      round((random() * 3)::numeric, 2)::real,
      '900' || lpad(gs::text, 9, '0'),
      null,
      jsonb_build_array(category, 'performance-test', 'каталог')
    from source
    `,
    [missing, batchToken],
  );

  const after = await countRows("products");
  console.log(`products seeded: ${before} -> ${after}`);
}

async function seedTrainingPlans(): Promise<void> {
  const before = await countRows("training_plans");
  const missing = Math.max(TARGET_ROWS_PER_TABLE - before, 0);
  if (missing === 0) {
    console.log(`training_plans already has ${before} rows; skipping.`);
    return;
  }

  const batchToken = `load-${Date.now()}`;

  await sql.query(
    `
    with source as (
      select
        gs,
        (array['lose_weight', 'muscle_gain', 'endurance', 'strength', 'mobility', 'general_fitness'])[1 + floor(random() * 6)::int] as goal_type,
        (array['beginner', 'intermediate', 'advanced'])[1 + floor(random() * 3)::int] as level,
        (array['none', 'gym', 'dumbbells', 'resistance bands', 'treadmill/bike'])[1 + floor(random() * 5)::int] as equipment_item
      from generate_series(1, $1::int) as gs
    )
    insert into training_plans (
      title,
      description,
      goal_type,
      level,
      duration_weeks,
      sessions_per_week,
      average_session_minutes,
      equipment,
      target_muscles,
      calories_burn_estimate,
      plan_structure,
      weekly_schedule,
      safety_notes
    )
    select
      'Тестов тренировъчен план ' || $2::text || '-' || gs,
      'Автоматично генериран тренировъчен план за performance тестове на каталога.',
      goal_type,
      level,
      4 + floor(random() * 13)::int,
      2 + floor(random() * 5)::int,
      20 + floor(random() * 70)::int,
      jsonb_build_array(equipment_item),
      jsonb_build_array('цяло тяло', 'крака', 'гръб', 'корем'),
      120 + floor(random() * 560)::int,
      jsonb_build_array('Загрявка и техника.', 'Основна тренировъчна част.', 'Разтягане и възстановяване.'),
      jsonb_build_array('Понеделник: тренировка A', 'Сряда: тренировка B', 'Петък: тренировка C'),
      jsonb_build_array('Започни с умерена интензивност.', 'Спри при остра болка.', 'Следи възстановяването.')
    from source
    `,
    [missing, batchToken],
  );

  const after = await countRows("training_plans");
  console.log(`training_plans seeded: ${before} -> ${after}`);
}

async function main(): Promise<void> {
  await ensureCatalogIndexes();
  await seedRecipes();
  await seedProducts();
  await seedTrainingPlans();
}

main().catch((err: unknown) => {
  console.error("Catalog load seed failed:", err);
  process.exit(1);
});
