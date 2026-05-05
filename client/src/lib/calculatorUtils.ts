export type Sex = "male" | "female";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "very" | "athlete";

export type GoalType = "lose_weight" | "maintain_weight" | "gain_weight";

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  athlete: 1.9,
};

export function calculateBMI(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Поднормено";
  if (bmi < 25) return "Нормално";
  if (bmi < 30) return "Наднормено";
  return "Затлъстяване";
}

export function calculateBMR(sex: Sex, age: number, heightCm: number, weightKg: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_FACTORS[activityLevel];
}

export function calculateCaloriesForGoal(tdee: number, goalType: GoalType): {
  calories: number;
  delta: number;
  explanation: string;
} {
  const deltaByGoal: Record<GoalType, number> = {
    lose_weight: -450,
    maintain_weight: 0,
    gain_weight: 300,
  };

  const delta = deltaByGoal[goalType];
  const calories = tdee + delta;

  const explanationByGoal: Record<GoalType, string> = {
    lose_weight: "Умерен дефицит за по-устойчиво сваляне на тегло.",
    maintain_weight: "Поддържащ прием за стабилно тегло.",
    gain_weight: "Лек излишък за контролирано покачване.",
  };

  return {
    calories,
    delta,
    explanation: explanationByGoal[goalType],
  };
}

export function calculateMacros(calorieGoal: number, weightKg: number, goalType: GoalType): {
  protein: number;
  carbs: number;
  fat: number;
} {
  const proteinPerKg: Record<GoalType, number> = {
    lose_weight: 2.2,
    maintain_weight: 1.8,
    gain_weight: 2,
  };

  const fatPerKg: Record<GoalType, number> = {
    lose_weight: 0.8,
    maintain_weight: 0.9,
    gain_weight: 1,
  };

  const protein = weightKg * proteinPerKg[goalType];
  const fat = weightKg * fatPerKg[goalType];
  const carbs = Math.max((calorieGoal - protein * 4 - fat * 9) / 4, 0);

  return { protein, carbs, fat };
}

export function calculateWaterIntake(weightKg: number, activityLevel: ActivityLevel): number {
  const activityBonusLiters: Record<ActivityLevel, number> = {
    sedentary: 0,
    light: 0.25,
    moderate: 0.5,
    very: 0.75,
    athlete: 1,
  };

  return weightKg * 0.033 + activityBonusLiters[activityLevel];
}

export function calculateIdealWeightRange(heightCm: number): {
  minWeight: number;
  maxWeight: number;
} {
  const h = heightCm / 100;
  return {
    minWeight: 18.5 * h * h,
    maxWeight: 24.9 * h * h,
  };
}

export function calculateGoalTimeline(
  currentWeightKg: number,
  targetWeightKg: number,
  weeklyChangeKg: number,
): {
  weeks: number;
  etaDate: Date;
  warning: string | null;
} {
  const safeWeeklyChange = Math.abs(weeklyChangeKg);
  const diff = Math.abs(targetWeightKg - currentWeightKg);
  const weeks = safeWeeklyChange > 0 ? diff / safeWeeklyChange : 0;

  const etaDate = new Date();
  etaDate.setDate(etaDate.getDate() + Math.ceil(weeks * 7));

  let warning: string | null = null;
  const isLoss = targetWeightKg < currentWeightKg;

  if (isLoss && safeWeeklyChange > 1) {
    warning = "Темпото за сваляне е агресивно. Помисли за до 1 кг/седмица.";
  }
  if (!isLoss && safeWeeklyChange > 0.5) {
    warning = "Темпото за качване е високо. Помисли за до 0.5 кг/седмица.";
  }

  return { weeks, etaDate, warning };
}
