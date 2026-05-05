const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

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

export type ProfileGender = "male" | "female";
export type ProfileActivityLevel = "sedentary" | "light" | "moderate" | "very";
export type ProfileGoalType = "lose_weight" | "maintain" | "gain_weight";

export type ApiProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: ProfileGender | null;
  age: number | null;
  heightCm: number | null;
  currentWeight: number | null;
  goalWeight: number | null;
  activityLevel: ProfileActivityLevel | null;
  goalType: ProfileGoalType | null;
  caloriesTarget: number | null;
  proteinTarget: number | null;
  carbsTarget: number | null;
  fatTarget: number | null;
  avatarDataUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  gender?: ProfileGender | null;
  age?: number | null;
  heightCm?: number | null;
  goalWeight?: number | null;
  activityLevel?: ProfileActivityLevel | null;
  goalType?: ProfileGoalType | null;
  caloriesTarget?: number | null;
  proteinTarget?: number | null;
  carbsTarget?: number | null;
  fatTarget?: number | null;
  avatarDataUrl?: string | null;
};

export const profileApi = {
  get: () => api<{ profile: ApiProfile }>("/api/profile"),
  update: (patch: UpdateProfileInput) =>
    api<{ profile: ApiProfile }>("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
};
