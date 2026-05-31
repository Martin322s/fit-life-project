import type { RecipeCategory, RecipeDifficulty } from "../services/recipesApi";

export const CATEGORY_OPTIONS: { value: RecipeCategory | ""; label: string }[] = [
  { value: "", label: "Всички" },
  { value: "breakfast", label: "Закуска" },
  { value: "lunch", label: "Обяд" },
  { value: "dinner", label: "Вечеря" },
  { value: "snack", label: "Снак" },
  { value: "high-protein", label: "Висок протеин" },
  { value: "low-calorie", label: "Нискокалорични" },
  { value: "vegetarian", label: "Вегетариански" },
];

export const DIFFICULTY_OPTIONS: { value: RecipeDifficulty | ""; label: string }[] = [
  { value: "", label: "Всички" },
  { value: "easy", label: "Лесно" },
  { value: "medium", label: "Средно" },
  { value: "hard", label: "Трудно" },
];

export const DIFFICULTY_COLOR: Record<RecipeDifficulty, string> = {
  easy: "#00E676",
  medium: "#FFB300",
  hard: "var(--c-error,#FF3D57)",
};

export function categoryLabel(category: RecipeCategory): string {
  return CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? category;
}

export function difficultyLabel(difficulty: RecipeDifficulty): string {
  return DIFFICULTY_OPTIONS.find((option) => option.value === difficulty)?.label ?? difficulty;
}
