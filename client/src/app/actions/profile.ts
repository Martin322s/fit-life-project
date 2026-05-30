"use server";

import { cookies } from "next/headers";
import { getUserFromToken } from "@/src/lib/server/auth";
import { getByUserId, updateByUserId, type UpdateProfileInput } from "@/src/lib/server/repositories/profile";

const TOKEN_COOKIE = "fitlife-token";

async function getAuthPayload() {
  const jar = await cookies();
  const token = jar.get(TOKEN_COOKIE)?.value ?? null;
  return getUserFromToken(token ? `Bearer ${token}` : null);
}

/** Server Action: fetch the current user's full profile. */
export async function getProfileAction() {
  const payload = await getAuthPayload();
  if (!payload) throw new Error("Unauthorized");
  return getByUserId(payload.sub);
}

/** Server Action: update the current user's profile. */
export async function updateProfileAction(patch: UpdateProfileInput) {
  const payload = await getAuthPayload();
  if (!payload) throw new Error("Unauthorized");
  return updateByUserId(payload.sub, patch);
}
