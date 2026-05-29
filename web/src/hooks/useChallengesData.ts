import { useCallback, useEffect, useMemo, useState } from "react";
import { challengesApi } from "../services/challengesApi";
import type {
  ApiChallenge,
  ApiUserChallenge,
  ChallengeCategory,
  ChallengeDifficulty,
  ChallengeTargetType,
  UserChallengeStatus,
} from "../services/challengesApi";

const LIMIT = 12;

export type ChallengesData = {
  isLoading: boolean;
  isUserLoading: boolean;
  error: string | null;
  userError: string | null;
  items: ApiChallenge[];
  userItems: ApiUserChallenge[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  search: string;
  category: ChallengeCategory | "";
  difficulty: ChallengeDifficulty | "";
  targetType: ChallengeTargetType | "";
  setSearch: (value: string) => void;
  setCategory: (value: ChallengeCategory | "") => void;
  setDifficulty: (value: ChallengeDifficulty | "") => void;
  setTargetType: (value: ChallengeTargetType | "") => void;
  setPage: (value: number) => void;
  refresh: () => void;
  joinChallenge: (challengeId: string) => Promise<void>;
  updateProgress: (userChallengeId: string, progressValue: number, status?: UserChallengeStatus) => Promise<void>;
  abandonChallenge: (userChallengeId: string) => Promise<void>;
  joinedByChallengeId: Map<string, ApiUserChallenge>;
};

export function useChallengesData(currentUserId?: string): ChallengesData {
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);
  const [items, setItems] = useState<ApiChallenge[]>([]);
  const [userItems, setUserItems] = useState<ApiUserChallenge[]>([]);
  const [page, setPageState] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearchState] = useState("");
  const [category, setCategoryState] = useState<ChallengeCategory | "">("");
  const [difficulty, setDifficultyState] = useState<ChallengeDifficulty | "">("");
  const [targetType, setTargetTypeState] = useState<ChallengeTargetType | "">("");
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setIsUserLoading(true);
    setError(null);
    setUserError(null);
    setTick((n) => n + 1);
  }, []);
  const setSearch = useCallback((value: string) => {
    setIsLoading(true);
    setError(null);
    setSearchState(value);
    setPageState(1);
  }, []);
  const setCategory = useCallback((value: ChallengeCategory | "") => {
    setIsLoading(true);
    setError(null);
    setCategoryState(value);
    setPageState(1);
  }, []);
  const setDifficulty = useCallback((value: ChallengeDifficulty | "") => {
    setIsLoading(true);
    setError(null);
    setDifficultyState(value);
    setPageState(1);
  }, []);
  const setTargetType = useCallback((value: ChallengeTargetType | "") => {
    setIsLoading(true);
    setError(null);
    setTargetTypeState(value);
    setPageState(1);
  }, []);
  const setPage = useCallback((value: number) => {
    setIsLoading(true);
    setError(null);
    setPageState(Math.max(1, value));
  }, []);

  useEffect(() => {
    challengesApi
      .list({ page, limit: LIMIT, search: search.trim() || undefined, category, difficulty, targetType })
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
        setTotalPages(res.totalPages);
        if (res.page !== page) setPageState(res.page);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Грешка при зареждане."))
      .finally(() => setIsLoading(false));
  }, [page, search, category, difficulty, targetType, tick]);

  useEffect(() => {
    challengesApi
      .listUserChallenges()
      .then((res) => {
        const filtered = currentUserId ? res.items.filter((item) => item.userId === currentUserId) : res.items;
        setUserItems(filtered);
      })
      .catch((err) => setUserError(err instanceof Error ? err.message : "Грешка при зареждане на участията."))
      .finally(() => setIsUserLoading(false));
  }, [currentUserId, tick]);

  const joinChallenge = useCallback(async (challengeId: string) => {
    setIsUserLoading(true);
    setUserError(null);
    await challengesApi.join(challengeId);
    refresh();
  }, [refresh]);

  const updateProgress = useCallback(async (userChallengeId: string, progressValue: number, status?: UserChallengeStatus) => {
    setIsUserLoading(true);
    setUserError(null);
    await challengesApi.updateUserChallenge(userChallengeId, { progressValue, status });
    refresh();
  }, [refresh]);

  const abandonChallenge = useCallback(async (userChallengeId: string) => {
    setIsUserLoading(true);
    setUserError(null);
    await challengesApi.removeUserChallenge(userChallengeId);
    refresh();
  }, [refresh]);

  const joinedByChallengeId = useMemo(() => new Map(userItems.map((item) => [item.challengeId, item])), [userItems]);

  return {
    isLoading,
    isUserLoading,
    error,
    userError,
    items,
    userItems,
    page,
    limit: LIMIT,
    total,
    totalPages,
    search,
    category,
    difficulty,
    targetType,
    setSearch,
    setCategory,
    setDifficulty,
    setTargetType,
    setPage,
    refresh,
    joinChallenge,
    updateProgress,
    abandonChallenge,
    joinedByChallengeId,
  };
}
