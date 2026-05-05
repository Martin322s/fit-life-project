import { useCallback, useEffect, useState } from "react";
import { dietsApi } from "../services/dietsApi";
import type { ApiDiet, DietCategory, DietDifficulty, DietGoalType } from "../services/dietsApi";

const LIMIT = 12;

export type DietsData = {
  isLoading: boolean;
  error: string | null;
  items: ApiDiet[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  search: string;
  category: DietCategory | "";
  goalType: DietGoalType | "";
  difficulty: DietDifficulty | "";
  setSearch: (value: string) => void;
  setCategory: (value: DietCategory | "") => void;
  setGoalType: (value: DietGoalType | "") => void;
  setDifficulty: (value: DietDifficulty | "") => void;
  setPage: (value: number) => void;
  refresh: () => void;
};

export function useDietsData(): DietsData {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ApiDiet[]>([]);
  const [page, setPageState] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearchState] = useState("");
  const [category, setCategoryState] = useState<DietCategory | "">("");
  const [goalType, setGoalTypeState] = useState<DietGoalType | "">("");
  const [difficulty, setDifficultyState] = useState<DietDifficulty | "">("");
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((n) => n + 1), []);
  const resetPage = () => setPageState(1);
  const setSearch = useCallback((value: string) => { setSearchState(value); resetPage(); }, []);
  const setCategory = useCallback((value: DietCategory | "") => { setCategoryState(value); resetPage(); }, []);
  const setGoalType = useCallback((value: DietGoalType | "") => { setGoalTypeState(value); resetPage(); }, []);
  const setDifficulty = useCallback((value: DietDifficulty | "") => { setDifficultyState(value); resetPage(); }, []);
  const setPage = useCallback((value: number) => setPageState(Math.max(1, value)), []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    dietsApi
      .list({ page, limit: LIMIT, search: search.trim() || undefined, category, goalType, difficulty })
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Грешка при зареждане."))
      .finally(() => setIsLoading(false));
  }, [page, search, category, goalType, difficulty, tick]);

  return { isLoading, error, items, page, limit: LIMIT, total, totalPages, search, category, goalType, difficulty, setSearch, setCategory, setGoalType, setDifficulty, setPage, refresh };
}
