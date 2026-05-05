import { useCallback, useEffect, useState } from "react";
import { recipesApi } from "../services/recipesApi";
import type { ApiRecipe, RecipeCategory, RecipeDifficulty } from "../services/recipesApi";

export type RecipesData = {
  isLoading: boolean;
  error: string | null;
  items: ApiRecipe[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  search: string;
  category: RecipeCategory | "";
  difficulty: RecipeDifficulty | "";
  setSearch: (value: string) => void;
  setCategory: (value: RecipeCategory | "") => void;
  setDifficulty: (value: RecipeDifficulty | "") => void;
  setPage: (value: number) => void;
  refresh: () => void;
};

const LIMIT = 12;

export function useRecipesData(): RecipesData {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ApiRecipe[]>([]);
  const [page, setPageState] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearchState] = useState("");
  const [category, setCategoryState] = useState<RecipeCategory | "">("");
  const [difficulty, setDifficultyState] = useState<RecipeDifficulty | "">("");
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((n) => n + 1), []);
  const setSearch = useCallback((value: string) => {
    setSearchState(value);
    setPageState(1);
  }, []);
  const setCategory = useCallback((value: RecipeCategory | "") => {
    setCategoryState(value);
    setPageState(1);
  }, []);
  const setDifficulty = useCallback((value: RecipeDifficulty | "") => {
    setDifficultyState(value);
    setPageState(1);
  }, []);
  const setPage = useCallback((value: number) => setPageState(Math.max(1, value)), []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    recipesApi
      .list({ page, limit: LIMIT, search: search.trim() || undefined, category, difficulty })
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
        setTotalPages(res.totalPages);
        if (res.page !== page) setPageState(res.page);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Грешка при зареждане."))
      .finally(() => setIsLoading(false));
  }, [page, search, category, difficulty, tick]);

  return {
    isLoading,
    error,
    items,
    page,
    limit: LIMIT,
    total,
    totalPages,
    search,
    category,
    difficulty,
    setSearch,
    setCategory,
    setDifficulty,
    setPage,
    refresh,
  };
}
