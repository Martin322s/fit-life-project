import { pgTable, uuid, text, integer, real, timestamp } from "drizzle-orm/pg-core";
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

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  workouts: many(workouts),
  meals: many(meals),
  goals: many(goals),
  progressEntries: many(progressEntries),
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
