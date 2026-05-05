import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { dashboardApi } from "../services/dashboardApi";
import type { ApiProgressEntry } from "../services/dashboardApi";
import { calcProfileMetrics, calcProfileMetricsFromApiProfile, readLocalProfile, readLocalProfilePage } from "../lib/mealUtils";
import { entriesWithWeight, round1, sortByDate } from "../lib/progressUtils";
import { profileApi, type ApiProfile } from "../services/profileApi";

export type WeightData = {
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  entriesNewest: ApiProgressEntry[];
  entriesOldest: ApiProgressEntry[];
  latest: ApiProgressEntry | null;
  previous: ApiProgressEntry | null;
  currentWeight: number | null;
  weightChange: number | null;
  totalEntries: number;
  minWeight: number | null;
  maxWeight: number | null;
  averageWeight: number | null;
  startWeight: number | null;
  goalWeight: number | null;
  heightCm: number | null;
  bmi: number | null;
  startBmi: number | null;
  goalBmi: number | null;
  totalChangeFromStart: number | null;
  remainingToGoal: number | null;
  goalProgressPct: number | null;
  loggedDaysLast35: boolean[];
  streak: number;
};

export function useWeightData(): WeightData {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ApiProgressEntry[]>([]);
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
      dashboardApi.getProgress(),
      profileApi.get().then((res) => res.profile).catch(() => null as ApiProfile | null),
    ])
      .then(([res, prof]) => {
        if (cancelled) return;
        setProgress(res.items);
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
  const myProgress = uid ? progress.filter((entry) => entry.userId === uid) : progress;
  const entriesNewest = sortByDate(entriesWithWeight(myProgress), "desc");
  const entriesOldest = sortByDate(entriesNewest, "asc");
  const latest = entriesNewest[0] ?? null;
  const previous = entriesNewest[1] ?? null;
  const currentWeight = latest?.weightKg ?? null;
  const weightChange = latest && previous ? round1(latest.weightKg - previous.weightKg) : null;

  const weights = entriesNewest.map((entry) => entry.weightKg);
  const totalEntries = entriesNewest.length;
  const minWeight = weights.length ? round1(Math.min(...weights)) : null;
  const maxWeight = weights.length ? round1(Math.max(...weights)) : null;
  const averageWeight = weights.length ? round1(weights.reduce((sum, w) => sum + w, 0) / weights.length) : null;

  const metrics = profile
    ? calcProfileMetricsFromApiProfile(profile, currentWeight)
    : calcProfileMetrics(readLocalProfile(), readLocalProfilePage(), currentWeight);
  const { heightCm, startWeightKg, targetWeightKg } = metrics;
  const oldestWeight = entriesOldest[0]?.weightKg ?? null;
  const startWeight = startWeightKg ?? oldestWeight;
  const goalWeight = targetWeightKg;

  const bmi = currentWeight != null && heightCm != null ? round1(currentWeight / (heightCm / 100) ** 2) : null;
  const startBmi = startWeight != null && heightCm != null ? round1(startWeight / (heightCm / 100) ** 2) : null;
  const goalBmi = goalWeight != null && heightCm != null ? round1(goalWeight / (heightCm / 100) ** 2) : null;
  const totalChangeFromStart = currentWeight != null && startWeight != null ? round1(currentWeight - startWeight) : null;
  const remainingToGoal = currentWeight != null && goalWeight != null ? round1(Math.abs(currentWeight - goalWeight)) : null;

  let goalProgressPct: number | null = null;
  if (startWeight != null && goalWeight != null && currentWeight != null && startWeight !== goalWeight) {
    const raw = ((startWeight - currentWeight) / (startWeight - goalWeight)) * 100;
    goalProgressPct = Math.max(0, Math.min(100, Math.round(raw)));
  }

  const loggedDateKeys = new Set(entriesNewest.map((entry) => new Date(entry.createdAt).toISOString().slice(0, 10)));
  const loggedDaysLast35 = Array.from({ length: 35 }, (_, index) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (34 - index));
    return loggedDateKeys.has(d.toISOString().slice(0, 10));
  });

  let streak = 0;
  for (let index = loggedDaysLast35.length - 1; index >= 0; index--) {
    if (!loggedDaysLast35[index]) break;
    streak += 1;
  }

  return {
    isLoading,
    error,
    refresh,
    entriesNewest,
    entriesOldest,
    latest,
    previous,
    currentWeight,
    weightChange,
    totalEntries,
    minWeight,
    maxWeight,
    averageWeight,
    startWeight,
    goalWeight,
    heightCm,
    bmi,
    startBmi,
    goalBmi,
    totalChangeFromStart,
    remainingToGoal,
    goalProgressPct,
    loggedDaysLast35,
    streak,
  };
}
