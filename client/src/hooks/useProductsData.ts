import { useCallback, useEffect, useState } from "react";
import { productsApi } from "../services/productsApi";
import type { ApiProduct, ProductCategory } from "../services/productsApi";

const LIMIT = 20;

export function useProductsData() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ApiProduct[]>([]);
  const [page, setPageState] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearchState] = useState("");
  const [category, setCategoryState] = useState<ProductCategory | "">("");
  const [highProtein, setHighProteinState] = useState(false);
  const [lowCalorie, setLowCalorieState] = useState(false);
  const [lowCarb, setLowCarbState] = useState(false);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((n) => n + 1), []);
  const resetPage = () => setPageState(1);
  const setSearch = useCallback((value: string) => { setSearchState(value); resetPage(); }, []);
  const setCategory = useCallback((value: ProductCategory | "") => { setCategoryState(value); resetPage(); }, []);
  const setHighProtein = useCallback((value: boolean) => { setHighProteinState(value); resetPage(); }, []);
  const setLowCalorie = useCallback((value: boolean) => { setLowCalorieState(value); resetPage(); }, []);
  const setLowCarb = useCallback((value: boolean) => { setLowCarbState(value); resetPage(); }, []);
  const setPage = useCallback((value: number) => setPageState(Math.max(1, value)), []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    productsApi
      .list({
        page,
        limit: LIMIT,
        search: search.trim() || undefined,
        category,
        minProtein: highProtein ? 15 : undefined,
        maxCalories: lowCalorie ? 120 : undefined,
        maxCarbs: lowCarb ? 10 : undefined,
      })
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Грешка при зареждане."))
      .finally(() => setIsLoading(false));
  }, [page, search, category, highProtein, lowCalorie, lowCarb, tick]);

  return { isLoading, error, items, page, limit: LIMIT, total, totalPages, search, category, highProtein, lowCalorie, lowCarb, setSearch, setCategory, setHighProtein, setLowCalorie, setLowCarb, setPage, refresh };
}
