import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { dashboardApi } from "../services/dashboardApi";
import type { ApiMeal } from "../services/dashboardApi";
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

export type CaloriesData = {
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  todayMeals: ApiMeal[];
  todayCalories: number;
  todayMacros: { protein: number; carbs: number; fat: number };
  remaining: number;
  goalCalories: number;
  tdee: number | null;
  macroTargets: { protein: number; carbs: number; fat: number };
};

export function useCaloriesData(): CaloriesData {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meals, setMeals] = useState<ApiMeal[]>([]);
  const [profile, setProfile] = useState<ApiProfile | null>(null);
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
      profileApi.get().then((res) => res.profile).catch(() => null as ApiProfile | null),
    ])
      .then(([r, prof]) => {
        if (cancelled) return;
        setMeals(r.items);
        setProfile(prof);
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
  const myMeals = uid ? meals.filter((m) => m.userId === uid) : meals;

  const todayMeals = myMeals
    .filter((m) => isToday(m.createdAt))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const todayCalories = sumCalories(todayMeals);
  const todayMacros = sumMacros(todayMeals);

  const metrics = profile
    ? calcProfileMetricsFromApiProfile(profile, profile.currentWeight)
    : calcProfileMetrics(readLocalProfile(), readLocalProfilePage());

  const { tdee, goalCalories, proteinTarget, carbTarget, fatTarget } = metrics;

  const remaining = Math.max(0, goalCalories - todayCalories);
  const macroTargets = { protein: proteinTarget, carbs: carbTarget, fat: fatTarget };

  return {
    isLoading,
    error,
    refresh,
    todayMeals,
    todayCalories,
    todayMacros,
    remaining,
    goalCalories,
    tdee,
    macroTargets,
  };
}
