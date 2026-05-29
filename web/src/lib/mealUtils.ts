import type { ApiMeal } from "../services/dashboardApi";

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

// ─── Meal aggregation ─────────────────────────────────────────────────────────

export function sumCalories(meals: ApiMeal[]): number {
  return meals.reduce((sum, m) => sum + m.calories, 0);
}

export function sumMacros(meals: ApiMeal[]): { protein: number; carbs: number; fat: number } {
  return meals.reduce(
    (acc, m) => ({
      protein: acc.protein + (m.protein ?? 0),
      carbs:   acc.carbs   + (m.carbs   ?? 0),
      fat:     acc.fat     + (m.fat     ?? 0),
    }),
    { protein: 0, carbs: 0, fat: 0 },
  );
}

// ─── localStorage profile readers ─────────────────────────────────────────────

export type LocalProfile = {
  age?: string;
  height?: string;
  heightUnit?: "cm" | "ft";
  weight?: string;
  weightUnit?: "kg" | "lb";
  gender?: "male" | "female" | "";
  goal?: "lose" | "maintain" | "gain" | "";
  activity?: "sedentary" | "light" | "moderate" | "very" | "";
};

export type LocalProfilePage = {
  goalWeight?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};

export type ApiMetricsProfile = {
  gender: "male" | "female" | null;
  age: number | null;
  heightCm: number | null;
  goalWeight: number | null;
  activityLevel: "sedentary" | "light" | "moderate" | "very" | null;
  goalType: "lose_weight" | "maintain" | "gain_weight" | null;
  caloriesTarget: number | null;
  proteinTarget: number | null;
  carbsTarget: number | null;
  fatTarget: number | null;
};

export function readLocalProfile(): LocalProfile | null {
  try {
    const raw = localStorage.getItem("fitlife-profile");
    return raw ? (JSON.parse(raw) as LocalProfile) : null;
  } catch {
    return null;
  }
}

export function readLocalProfilePage(): LocalProfilePage | null {
  try {
    const raw = localStorage.getItem("fitlife-profile-page");
    return raw ? (JSON.parse(raw) as LocalProfilePage) : null;
  } catch {
    return null;
  }
}

// ─── Profile-derived calculations ─────────────────────────────────────────────

const ACTIVITY_FACTORS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
};

export type ProfileMetrics = {
  heightCm: number | null;
  startWeightKg: number | null;
  targetWeightKg: number | null;
  bmr: number | null;
  tdee: number | null;
  goalCalories: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
};

export function calcProfileMetrics(
  profile: LocalProfile | null,
  profilePage: LocalProfilePage | null,
  currentWeightKg?: number | null,
): ProfileMetrics {
  let heightCm: number | null = null;
  if (profile?.height) {
    const h = parseFloat(profile.height);
    if (!isNaN(h)) heightCm = profile.heightUnit === "ft" ? +(h * 30.48).toFixed(1) : h;
  }

  let startWeightKg: number | null = null;
  if (profile?.weight) {
    const w = parseFloat(profile.weight);
    if (!isNaN(w)) startWeightKg = profile.weightUnit === "lb" ? +(w * 0.453592).toFixed(1) : w;
  }

  let targetWeightKg: number | null = null;
  if (profilePage?.goalWeight != null) {
    targetWeightKg =
      profile?.weightUnit === "lb"
        ? +(profilePage.goalWeight * 0.453592).toFixed(1)
        : profilePage.goalWeight;
  }

  const weightForCalc = currentWeightKg ?? startWeightKg;
  let bmr: number | null = null;
  if (weightForCalc != null && heightCm != null && profile?.age) {
    const age = parseFloat(profile.age);
    if (!isNaN(age)) {
      const raw =
        profile.gender === "female"
          ? 10 * weightForCalc + 6.25 * heightCm - 5 * age - 161
          : 10 * weightForCalc + 6.25 * heightCm - 5 * age + 5;
      bmr = Math.round(raw);
    }
  }

  let tdee: number | null = null;
  if (bmr != null && profile?.activity) {
    tdee = Math.round(bmr * (ACTIVITY_FACTORS[profile.activity] ?? 1.2));
  }

  const goalCalories = profilePage?.calories ?? (tdee != null ? tdee - 300 : 2000);
  const proteinTarget = profilePage?.protein ?? (weightForCalc ? Math.round(weightForCalc * 2) : 165);
  const fatTarget = profilePage?.fat ?? Math.max(Math.round((goalCalories * 0.25) / 9), 30);
  const carbTarget = profilePage?.carbs ?? Math.max(Math.round((goalCalories - proteinTarget * 4 - fatTarget * 9) / 4), 50);

  return { heightCm, startWeightKg, targetWeightKg, bmr, tdee, goalCalories, proteinTarget, carbTarget, fatTarget };
}

export function calcProfileMetricsFromApiProfile(
  profile: ApiMetricsProfile | null,
  currentWeightKg?: number | null,
): ProfileMetrics {
  if (!profile) {
    return calcProfileMetrics(null, null, currentWeightKg);
  }

  const localProfile: LocalProfile = {
    age: profile.age != null ? String(profile.age) : undefined,
    height: profile.heightCm != null ? String(profile.heightCm) : undefined,
    heightUnit: profile.heightCm != null ? "cm" : undefined,
    gender: profile.gender ?? "",
    goal:
      profile.goalType === "lose_weight"
        ? "lose"
        : profile.goalType === "gain_weight"
          ? "gain"
          : profile.goalType === "maintain"
            ? "maintain"
            : "",
    activity: profile.activityLevel ?? "",
  };

  const localProfilePage: LocalProfilePage = {
    goalWeight: profile.goalWeight ?? undefined,
    calories: profile.caloriesTarget ?? undefined,
    protein: profile.proteinTarget ?? undefined,
    carbs: profile.carbsTarget ?? undefined,
    fat: profile.fatTarget ?? undefined,
  };

  return calcProfileMetrics(localProfile, localProfilePage, currentWeightKg);
}
