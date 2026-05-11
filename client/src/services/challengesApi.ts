import { API_BASE_URL as BASE } from "./apiConfig";

function token(): string | null {
  return localStorage.getItem("fitlife-token") ?? sessionStorage.getItem("fitlife-token");
}

async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const t = token();
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...(opts.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "Грешка при заявката.");
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type ChallengeCategory = "fitness" | "nutrition" | "hydration" | "weight loss" | "habits" | "beginner" | "consistency";
export type ChallengeDifficulty = "easy" | "medium" | "hard";
export type ChallengeTargetType = "steps" | "workouts" | "weight_loss" | "calories_burned" | "water" | "consistency" | "custom";
export type UserChallengeStatus = "active" | "completed" | "abandoned";

export type ApiChallenge = {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  durationDays: number;
  targetType: ChallengeTargetType;
  targetValue: number;
  targetUnit: string;
  rewardText: string | null;
  rules: string[];
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiUserChallenge = {
  id: string;
  userId: string;
  challengeId: string;
  status: UserChallengeStatus;
  progressValue: number;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  challenge: ApiChallenge;
};

export type ChallengesPage = {
  items: ApiChallenge[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ChallengesQuery = {
  page: number;
  limit: number;
  search?: string;
  category?: ChallengeCategory | "";
  difficulty?: ChallengeDifficulty | "";
  targetType?: ChallengeTargetType | "";
};

function queryString(query: ChallengesQuery): string {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.difficulty) params.set("difficulty", query.difficulty);
  if (query.targetType) params.set("targetType", query.targetType);
  return params.toString();
}

export const challengesApi = {
  list: (query: ChallengesQuery) => api<ChallengesPage>(`/api/challenges?${queryString(query)}`),
  get: (id: string) => api<{ item: ApiChallenge }>(`/api/challenges/${id}`),
  listUserChallenges: () => api<{ items: ApiUserChallenge[] }>("/api/user-challenges"),
  join: (challengeId: string) => api<{ item: ApiUserChallenge }>("/api/user-challenges", { method: "POST", body: JSON.stringify({ challengeId }) }),
  updateUserChallenge: (id: string, data: { progressValue?: number; status?: UserChallengeStatus }) =>
    api<{ item: ApiUserChallenge }>(`/api/user-challenges/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  removeUserChallenge: (id: string) => api<void>(`/api/user-challenges/${id}`, { method: "DELETE" }),
};
