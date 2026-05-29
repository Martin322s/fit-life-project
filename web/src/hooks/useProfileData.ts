import { useCallback, useEffect, useState } from "react";
import { profileApi, type ApiProfile, type UpdateProfileInput } from "../services/profileApi";

export type UseProfileDataResult = {
  profile: ApiProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveError: string | null;
  saveSuccess: string | null;
  refresh: () => Promise<void>;
  save: (patch: UpdateProfileInput) => Promise<ApiProfile | null>;
};

export function useProfileData(): UseProfileDataResult {
  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { profile: next } = await profileApi.get();
      setProfile(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Грешка при зареждане на профила.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const save = useCallback(async (patch: UpdateProfileInput) => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      const { profile: updated } = await profileApi.update(patch);
      setProfile(updated);
      setSaveSuccess("Профилът е запазен успешно.");
      return updated;
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Грешка при запазване.");
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { profile, isLoading, isSaving, error, saveError, saveSuccess, refresh, save };
}
