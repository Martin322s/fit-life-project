import { pgTable, uuid, text, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").$type<"user" | "admin">().notNull().default("user"),
  gender: text("gender"),
  age: integer("age"),
  height: real("height"),
  heightUnit: text("height_unit"),
  weight: real("weight"),
  weightUnit: text("weight_unit"),
  goal: text("goal"),
  activity: text("activity"),
  heightCm: real("height_cm"),
  goalWeight: real("goal_weight"),
  activityLevel: text("activity_level").$type<"sedentary" | "light" | "moderate" | "very">(),
  goalType: text("goal_type").$type<"lose_weight" | "maintain" | "gain_weight">(),
  caloriesTarget: integer("calories_target"),
  proteinTarget: real("protein_target"),
  carbsTarget: real("carbs_target"),
  fatTarget: real("fat_target"),
  avatarUrl: text("avatar_url"),
  passwordResetTokenHash: text("password_reset_token_hash"),
  passwordResetExpiresAt: timestamp("password_reset_expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type DbUser = typeof users.$inferSelect;
export type NewDbUser = typeof users.$inferInsert;

// ─── Workouts ─────────────────────────────────────────────────────────────────

export const workouts = pgTable("workouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  caloriesBurned: integer("calories_burned"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type DbWorkout = typeof workouts.$inferSelect;
export type NewDbWorkout = typeof workouts.$inferInsert;

// ─── Meals ────────────────────────────────────────────────────────────────────

export const meals = pgTable("meals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  calories: integer("calories").notNull(),
  protein: real("protein"),
  carbs: real("carbs"),
  fat: real("fat"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type DbMeal = typeof meals.$inferSelect;
export type NewDbMeal = typeof meals.$inferInsert;

// ─── Goals ────────────────────────────────────────────────────────────────────

export type GoalStatus = "active" | "completed" | "abandoned";

export const goals = pgTable("goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  targetValue: real("target_value").notNull(),
  currentValue: real("current_value").notNull().default(0),
  unit: text("unit").notNull(),
  status: text("status").$type<GoalStatus>().notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type DbGoal = typeof goals.$inferSelect;
export type NewDbGoal = typeof goals.$inferInsert;

// ─── Progress Entries ─────────────────────────────────────────────────────────

export const progressEntries = pgTable("progress_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  weightKg: real("weight_kg"),
  waistCm: real("waist_cm"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type DbProgressEntry = typeof progressEntries.$inferSelect;
export type NewDbProgressEntry = typeof progressEntries.$inferInsert;

// ─── Recipes ─────────────────────────────────────────────────────────────────

export const recipes = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  calories: integer("calories").notNull(),
  protein: real("protein").notNull(),
  carbs: real("carbs").notNull(),
  fat: real("fat").notNull(),
  prepMinutes: integer("prep_minutes").notNull(),
  difficulty: text("difficulty").notNull(),
  ingredients: jsonb("ingredients").$type<string[]>().notNull(),
  instructions: jsonb("instructions").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type DbRecipe = typeof recipes.$inferSelect;
export type NewDbRecipe = typeof recipes.$inferInsert;

// ─── Diets ───────────────────────────────────────────────────────────────────

export const diets = pgTable("diets", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  goalType: text("goal_type").$type<"lose_weight" | "maintain_weight" | "gain_weight" | "health">().notNull(),
  durationDays: integer("duration_days").notNull(),
  difficulty: text("difficulty").notNull(),
  caloriesPerDay: integer("calories_per_day").notNull(),
  proteinTarget: real("protein_target").notNull(),
  carbsTarget: real("carbs_target").notNull(),
  fatTarget: real("fat_target").notNull(),
  rules: jsonb("rules").$type<string[]>().notNull(),
  sampleMenu: jsonb("sample_menu").$type<string[]>().notNull(),
  suitableFor: jsonb("suitable_for").$type<string[]>().notNull(),
  notSuitableFor: jsonb("not_suitable_for").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type DbDiet = typeof diets.$inferSelect;
export type NewDbDiet = typeof diets.$inferInsert;

// ─── Training Plans ───────────────────────────────────────────────────────────

export const trainingPlans = pgTable("training_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  goalType: text("goal_type").$type<"lose_weight" | "muscle_gain" | "endurance" | "strength" | "mobility" | "general_fitness">().notNull(),
  level: text("level").$type<"beginner" | "intermediate" | "advanced">().notNull(),
  durationWeeks: integer("duration_weeks").notNull(),
  sessionsPerWeek: integer("sessions_per_week").notNull(),
  averageSessionMinutes: integer("average_session_minutes").notNull(),
  equipment: jsonb("equipment").$type<string[]>().notNull(),
  targetMuscles: jsonb("target_muscles").$type<string[]>().notNull(),
  caloriesBurnEstimate: integer("calories_burn_estimate"),
  planStructure: jsonb("plan_structure").$type<string[]>().notNull(),
  weeklySchedule: jsonb("weekly_schedule").$type<string[]>().notNull(),
  safetyNotes: jsonb("safety_notes").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type DbTrainingPlan = typeof trainingPlans.$inferSelect;
export type NewDbTrainingPlan = typeof trainingPlans.$inferInsert;

// ─── Products ────────────────────────────────────────────────────────────────

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  brand: text("brand"),
  servingSize: real("serving_size").notNull(),
  servingUnit: text("serving_unit").notNull(),
  calories: integer("calories").notNull(),
  protein: real("protein").notNull(),
  carbs: real("carbs").notNull(),
  fat: real("fat").notNull(),
  sugar: real("sugar"),
  fiber: real("fiber"),
  salt: real("salt"),
  barcode: text("barcode"),
  imageUrl: text("image_url"),
  tags: jsonb("tags").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type DbProduct = typeof products.$inferSelect;
export type NewDbProduct = typeof products.$inferInsert;

// ─── Challenges ──────────────────────────────────────────────────────────────

export type ChallengeTargetType =
  | "steps"
  | "workouts"
  | "weight_loss"
  | "calories_burned"
  | "water"
  | "consistency"
  | "custom";

export const challenges = pgTable("challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  durationDays: integer("duration_days").notNull(),
  targetType: text("target_type").$type<ChallengeTargetType>().notNull(),
  targetValue: real("target_value").notNull(),
  targetUnit: text("target_unit").notNull(),
  rewardText: text("reward_text"),
  rules: jsonb("rules").$type<string[]>().notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type DbChallenge = typeof challenges.$inferSelect;
export type NewDbChallenge = typeof challenges.$inferInsert;

export type UserChallengeStatus = "active" | "completed" | "abandoned";

export const userChallenges = pgTable("user_challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  challengeId: uuid("challenge_id").notNull().references(() => challenges.id, { onDelete: "cascade" }),
  status: text("status").$type<UserChallengeStatus>().notNull().default("active"),
  progressValue: real("progress_value").notNull().default(0),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type DbUserChallenge = typeof userChallenges.$inferSelect;
export type NewDbUserChallenge = typeof userChallenges.$inferInsert;

// ─── Hydration Entries ───────────────────────────────────────────────────────

export const hydrationEntries = pgTable("hydration_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amountMl: integer("amount_ml").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type DbHydrationEntry = typeof hydrationEntries.$inferSelect;
export type NewDbHydrationEntry = typeof hydrationEntries.$inferInsert;

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  workouts: many(workouts),
  meals: many(meals),
  goals: many(goals),
  progressEntries: many(progressEntries),
  userChallenges: many(userChallenges),
  hydrationEntries: many(hydrationEntries),
}));

export const workoutsRelations = relations(workouts, ({ one }) => ({
  user: one(users, { fields: [workouts.userId], references: [users.id] }),
}));

export const mealsRelations = relations(meals, ({ one }) => ({
  user: one(users, { fields: [meals.userId], references: [users.id] }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, { fields: [goals.userId], references: [users.id] }),
}));

export const progressEntriesRelations = relations(progressEntries, ({ one }) => ({
  user: one(users, { fields: [progressEntries.userId], references: [users.id] }),
}));

export const challengesRelations = relations(challenges, ({ many }) => ({
  userChallenges: many(userChallenges),
}));

export const userChallengesRelations = relations(userChallenges, ({ one }) => ({
  user: one(users, { fields: [userChallenges.userId], references: [users.id] }),
  challenge: one(challenges, { fields: [userChallenges.challengeId], references: [challenges.id] }),
}));

export const hydrationEntriesRelations = relations(hydrationEntries, ({ one }) => ({
  user: one(users, { fields: [hydrationEntries.userId], references: [users.id] }),
}));
