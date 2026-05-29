import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { dashboardApi } from "../services/dashboardApi";
import type { ApiMeal, ApiProgressEntry, ApiGoal, ApiWorkout } from "../services/dashboardApi";
import {
  isToday,
  sumCalories,
  sumMacros,
  calcProfileMetricsFromApiProfile,
  readLocalProfile,
  readLocalProfilePage,
  calcProfileMetrics,
} from "../lib/mealUtils";
import { profileApi, type ApiProfile } from "../services/profileApi";
import { hydrationApi } from "../services/hydrationApi";

const MONTHS_BG = ["Яну","Фев","Мар","Апр","Май","Юни","Юли","Авг","Сеп","Окт","Ное","Дек"];

// ─── Public type ──────────────────────────────────────────────────────────────

export type DashboardData = {
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  // meals
  todayMeals: ApiMeal[];
  todayCalories: number;
  todayMacros: { protein: number; carbs: number; fat: number };
  // weight / progress
  currentWeight: number | null;
  weightChange: number | null;
  weightHistory: { date: string; w: number }[];
  // profile-derived
  heightCm: number | null;
  bmi: number | null;
  bmr: number | null;
  tdee: number | null;
  goalCalories: number;
  startWeight: number | null;
  targetWeight: number | null;
  macroTargets: { protein: number; carbs: number; fat: number };
  // goals & workouts
  activeGoals: ApiGoal[];
  todayWorkouts: ApiWorkout[];
  // water
  water: { consumed: number; target: number; totalMl: number };
  steps: { today: number; target: number };
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboardData(): DashboardData {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meals, setMeals] = useState<ApiMeal[]>([]);
  const [progress, setProgress] = useState<ApiProgressEntry[]>([]);
  const [goals, setGoals] = useState<ApiGoal[]>([]);
  const [workouts, setWorkouts] = useState<ApiWorkout[]>([]);
  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [waterMl, setWaterMl] = useState(0);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        setIsLoading(true);
        setError(null);
      }
    });

    Promise.all([
      dashboardApi.getMeals(),
      dashboardApi.getProgress(),
      dashboardApi.getGoals(),
      dashboardApi.getWorkouts(),
      profileApi.get().then((res) => res.profile).catch(() => null as ApiProfile | null),
      hydrationApi.getToday().catch(() => ({ items: [], totalMl: 0 })),
    ])
      .then(([m, p, g, w, prof, hyd]) => {
        if (cancelled) return;
        setMeals(m.items);
        setProgress(p.items);
        setGoals(g.items);
        setWorkouts(w.items);
        setProfile(prof);
        setWaterMl(hyd.totalMl);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Грешка при зареждане.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  const uid = user?.id;

  // Admin accounts get all users' data — filter to current user only.
  const myMeals    = uid ? meals.filter((m) => m.userId === uid)    : meals;
  const myProgress = uid ? progress.filter((p) => p.userId === uid) : progress;
  const myGoals    = uid ? goals.filter((g) => g.userId === uid)    : goals;
  const myWorkouts = uid ? workouts.filter((w) => w.userId === uid) : workouts;

  // ── Today's meals ───────────────────────────────────────────────────────────
  const todayMeals = myMeals
    .filter((m) => isToday(m.createdAt))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const todayCalories = sumCalories(todayMeals);
  const todayMacros   = sumMacros(todayMeals);

  // ── Weight / progress ───────────────────────────────────────────────────────
  const progressWithWeight = myProgress
    .filter((p) => p.weightKg != null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const currentWeight = progressWithWeight[0]?.weightKg ?? null;
  const weightChange =
    progressWithWeight.length >= 2
      ? +((progressWithWeight[0].weightKg! - progressWithWeight[1].weightKg!).toFixed(1))
      : null;

  // Last 7 entries, oldest → newest (for chart left-to-right)
  const weightHistory = progressWithWeight
    .slice(0, 7)
    .reverse()
    .map((p) => {
      const d = new Date(p.createdAt);
      return { date: `${d.getDate()} ${MONTHS_BG[d.getMonth()]}`, w: p.weightKg! };
    });

  // ── Profile-derived calculations (shared util) ───────────────────────────────
  const metrics = profile
    ? calcProfileMetricsFromApiProfile(profile, currentWeight)
    : calcProfileMetrics(readLocalProfile(), readLocalProfilePage(), currentWeight);

  const {
    heightCm,
    startWeightKg,
    targetWeightKg,
    bmr,
    tdee,
    goalCalories,
    proteinTarget,
    carbTarget,
    fatTarget,
  } = metrics;

  const bmi =
    currentWeight != null && heightCm != null
      ? +(currentWeight / (heightCm / 100) ** 2).toFixed(1)
      : null;

  const macroTargets = { protein: proteinTarget, carbs: carbTarget, fat: fatTarget };
  const activeGoals  = myGoals.filter((g) => g.status === "active");
  const todayWorkouts = myWorkouts.filter((w) => isToday(w.createdAt));

  return {
    isLoading,
    error,
    refresh,
    todayMeals,
    todayCalories,
    todayMacros,
    currentWeight,
    weightChange,
    weightHistory,
    heightCm,
    bmi,
    bmr,
    tdee,
    goalCalories,
    startWeight:  startWeightKg,
    targetWeight: targetWeightKg,
    macroTargets,
    activeGoals,
    todayWorkouts,
    water: { consumed: Math.floor(waterMl / 250), target: 8, totalMl: waterMl },
    steps: { today: 0, target: 10000 },
  };
}
