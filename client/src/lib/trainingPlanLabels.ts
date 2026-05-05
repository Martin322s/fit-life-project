import type { TrainingEquipment, TrainingGoalType, TrainingLevel } from "../services/trainingPlansApi";

export const TRAINING_GOAL_OPTIONS: { value: TrainingGoalType | ""; label: string }[] = [
  { value: "", label: "Всички цели" },
  { value: "lose_weight", label: "Отслабване" },
  { value: "muscle_gain", label: "Мускулна маса" },
  { value: "endurance", label: "Издръжливост" },
  { value: "strength", label: "Сила" },
  { value: "mobility", label: "Мобилност" },
  { value: "general_fitness", label: "Обща форма" },
];

export const TRAINING_LEVEL_OPTIONS: { value: TrainingLevel | ""; label: string }[] = [
  { value: "", label: "Всички нива" },
  { value: "beginner", label: "Начинаещ" },
  { value: "intermediate", label: "Средно ниво" },
  { value: "advanced", label: "Напреднал" },
];

export const TRAINING_EQUIPMENT_OPTIONS: { value: TrainingEquipment | ""; label: string }[] = [
  { value: "", label: "Всяко оборудване" },
  { value: "none", label: "Без оборудване" },
  { value: "dumbbells", label: "Дъмбели" },
  { value: "gym", label: "Фитнес" },
  { value: "resistance bands", label: "Ластици" },
  { value: "treadmill/bike", label: "Пътека/колело" },
];

export const TRAINING_LEVEL_COLOR: Record<TrainingLevel, string> = {
  beginner: "#00E676",
  intermediate: "#FFB300",
  advanced: "var(--c-error,#FF3D57)",
};

export function trainingGoalLabel(value: TrainingGoalType): string {
  return TRAINING_GOAL_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function trainingLevelLabel(value: TrainingLevel): string {
  return TRAINING_LEVEL_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function trainingEquipmentLabel(value: TrainingEquipment): string {
  return TRAINING_EQUIPMENT_OPTIONS.find((option) => option.value === value)?.label ?? value;
}
