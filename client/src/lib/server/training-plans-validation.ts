import { NextResponse } from "next/server";
import type { TrainingPlanInput, UpdateTrainingPlanInput } from "./repositories/training-plans";

const GOALS = new Set(["lose_weight", "muscle_gain", "endurance", "strength", "mobility", "general_fitness"]);
const LEVELS = new Set(["beginner", "intermediate", "advanced"]);
const EQUIPMENT = new Set(["none", "dumbbells", "gym", "resistance bands", "treadmill/bike"]);

function badRequest(message: string): NextResponse {
  return NextResponse.json({ message }, { status: 400 });
}

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const items = value.map((item) => String(item).trim()).filter(Boolean);
  return items.length ? items : null;
}

function validGoal(value: string): value is TrainingPlanInput["goalType"] {
  return GOALS.has(value);
}

function validLevel(value: string): value is TrainingPlanInput["level"] {
  return LEVELS.has(value);
}

function validEquipment(items: string[]): boolean {
  return items.every((item) => EQUIPMENT.has(item));
}

function numberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  return Number(value);
}

export function parseTrainingPlanCreate(body: Record<string, unknown> | null): TrainingPlanInput | NextResponse {
  if (!body) return badRequest("Invalid request body.");
  const equipment = asStringArray(body.equipment);
  const targetMuscles = asStringArray(body.targetMuscles);
  const planStructure = asStringArray(body.planStructure);
  const weeklySchedule = asStringArray(body.weeklySchedule);
  const safetyNotes = asStringArray(body.safetyNotes);

  if (!body.title || !body.description || !body.goalType || !body.level || !equipment || !targetMuscles || !planStructure || !weeklySchedule || !safetyNotes) {
    return badRequest("Missing required training plan fields.");
  }

  const goalType = String(body.goalType);
  const level = String(body.level);
  if (!validGoal(goalType)) return badRequest("Invalid goalType.");
  if (!validLevel(level)) return badRequest("Invalid level.");
  if (!validEquipment(equipment)) return badRequest("Invalid equipment.");

  return {
    title: String(body.title).trim(),
    description: String(body.description).trim(),
    goalType,
    level,
    durationWeeks: Number(body.durationWeeks),
    sessionsPerWeek: Number(body.sessionsPerWeek),
    averageSessionMinutes: Number(body.averageSessionMinutes),
    equipment,
    targetMuscles,
    caloriesBurnEstimate: numberOrNull(body.caloriesBurnEstimate),
    planStructure,
    weeklySchedule,
    safetyNotes,
  };
}

export function parseTrainingPlanPatch(body: Record<string, unknown> | null): UpdateTrainingPlanInput | NextResponse {
  if (!body) return badRequest("Invalid request body.");
  const patch: UpdateTrainingPlanInput = {};

  if (body.title !== undefined) patch.title = String(body.title).trim();
  if (body.description !== undefined) patch.description = String(body.description).trim();
  if (body.goalType !== undefined) {
    const goalType = String(body.goalType);
    if (!validGoal(goalType)) return badRequest("Invalid goalType.");
    patch.goalType = goalType;
  }
  if (body.level !== undefined) {
    const level = String(body.level);
    if (!validLevel(level)) return badRequest("Invalid level.");
    patch.level = level;
  }
  if (body.durationWeeks !== undefined) patch.durationWeeks = Number(body.durationWeeks);
  if (body.sessionsPerWeek !== undefined) patch.sessionsPerWeek = Number(body.sessionsPerWeek);
  if (body.averageSessionMinutes !== undefined) patch.averageSessionMinutes = Number(body.averageSessionMinutes);
  if (body.caloriesBurnEstimate !== undefined) patch.caloriesBurnEstimate = numberOrNull(body.caloriesBurnEstimate);
  if (body.equipment !== undefined) {
    const equipment = asStringArray(body.equipment);
    if (!equipment || !validEquipment(equipment)) return badRequest("Invalid equipment.");
    patch.equipment = equipment;
  }
  if (body.targetMuscles !== undefined) {
    const targetMuscles = asStringArray(body.targetMuscles);
    if (!targetMuscles) return badRequest("targetMuscles must be a non-empty array.");
    patch.targetMuscles = targetMuscles;
  }
  if (body.planStructure !== undefined) {
    const planStructure = asStringArray(body.planStructure);
    if (!planStructure) return badRequest("planStructure must be a non-empty array.");
    patch.planStructure = planStructure;
  }
  if (body.weeklySchedule !== undefined) {
    const weeklySchedule = asStringArray(body.weeklySchedule);
    if (!weeklySchedule) return badRequest("weeklySchedule must be a non-empty array.");
    patch.weeklySchedule = weeklySchedule;
  }
  if (body.safetyNotes !== undefined) {
    const safetyNotes = asStringArray(body.safetyNotes);
    if (!safetyNotes) return badRequest("safetyNotes must be a non-empty array.");
    patch.safetyNotes = safetyNotes;
  }

  return patch;
}
