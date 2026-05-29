import { useCallback, useEffect, useState } from "react";
import { trainingPlansApi } from "../services/trainingPlansApi";
import type { ApiTrainingPlan, TrainingEquipment, TrainingGoalType, TrainingLevel } from "../services/trainingPlansApi";

const LIMIT = 12;

export type TrainingPlansData = {
  isLoading: boolean;
  error: string | null;
  items: ApiTrainingPlan[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  search: string;
  goalType: TrainingGoalType | "";
  level: TrainingLevel | "";
  equipment: TrainingEquipment | "";
  setSearch: (value: string) => void;
  setGoalType: (value: TrainingGoalType | "") => void;
  setLevel: (value: TrainingLevel | "") => void;
  setEquipment: (value: TrainingEquipment | "") => void;
  setPage: (value: number) => void;
  refresh: () => void;
};

export function useTrainingPlansData(): TrainingPlansData {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ApiTrainingPlan[]>([]);
  const [page, setPageState] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearchState] = useState("");
  const [goalType, setGoalTypeState] = useState<TrainingGoalType | "">("");
  const [level, setLevelState] = useState<TrainingLevel | "">("");
  const [equipment, setEquipmentState] = useState<TrainingEquipment | "">("");
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((n) => n + 1), []);
  const resetPage = () => setPageState(1);
  const setSearch = useCallback((value: string) => { setSearchState(value); resetPage(); }, []);
  const setGoalType = useCallback((value: TrainingGoalType | "") => { setGoalTypeState(value); resetPage(); }, []);
  const setLevel = useCallback((value: TrainingLevel | "") => { setLevelState(value); resetPage(); }, []);
  const setEquipment = useCallback((value: TrainingEquipment | "") => { setEquipmentState(value); resetPage(); }, []);
  const setPage = useCallback((value: number) => setPageState(Math.max(1, value)), []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    trainingPlansApi
      .list({ page, limit: LIMIT, search: search.trim() || undefined, goalType, level, equipment })
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Грешка при зареждане."))
      .finally(() => setIsLoading(false));
  }, [page, search, goalType, level, equipment, tick]);

  return { isLoading, error, items, page, limit: LIMIT, total, totalPages, search, goalType, level, equipment, setSearch, setGoalType, setLevel, setEquipment, setPage, refresh };
}
