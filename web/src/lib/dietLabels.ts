import type { DietCategory, DietDifficulty, DietGoalType } from "../services/dietsApi";

export const DIET_CATEGORY_OPTIONS: { value: DietCategory | ""; label: string }[] = [
  { value: "", label: "Всички" },
  { value: "balanced", label: "Балансирани" },
  { value: "high-protein", label: "Висок протеин" },
  { value: "low-carb", label: "Нисковъглехидратни" },
  { value: "calorie-deficit", label: "Калориен дефицит" },
  { value: "vegetarian", label: "Вегетариански" },
  { value: "muscle-gain", label: "Мускулна маса" },
  { value: "heart-healthy", label: "Сърдечно здраве" },
];

export const DIET_GOAL_OPTIONS: { value: DietGoalType | ""; label: string }[] = [
  { value: "", label: "Всички цели" },
  { value: "lose_weight", label: "Отслабване" },
  { value: "maintain_weight", label: "Поддържане" },
  { value: "gain_weight", label: "Покачване" },
  { value: "health", label: "Здраве" },
];

export const DIET_DIFFICULTY_OPTIONS: { value: DietDifficulty | ""; label: string }[] = [
  { value: "", label: "Всички" },
  { value: "easy", label: "Лесно" },
  { value: "medium", label: "Средно" },
  { value: "hard", label: "Трудно" },
];

export const DIET_DIFFICULTY_COLOR: Record<DietDifficulty, string> = {
  easy: "#00E676",
  medium: "#FFB300",
  hard: "var(--c-error,#FF3D57)",
};

export function dietCategoryLabel(value: DietCategory): string {
  return DIET_CATEGORY_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function dietGoalLabel(value: DietGoalType): string {
  return DIET_GOAL_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function dietDifficultyLabel(value: DietDifficulty): string {
  return DIET_DIFFICULTY_OPTIONS.find((option) => option.value === value)?.label ?? value;
}
