"use server";

import { cookies } from "next/headers";
import { getUserFromToken } from "@/src/lib/server/auth";
import * as repo from "@/src/lib/server/repositories/progress";

const TOKEN_COOKIE = "fitlife-token";

async function requireUser() {
  const jar = await cookies();
  const token = jar.get(TOKEN_COOKIE)?.value ?? null;
  const payload = getUserFromToken(token ? `Bearer ${token}` : null);
  if (!payload) throw new Error("Unauthorized");
  return payload;
}

/** Server Action: list weight/measurement progress entries for the current user. */
export async function getProgressAction() {
  const { sub: userId } = await requireUser();
  return repo.listByUser(userId);
}

/** Server Action: log a new weight/measurement entry. */
export async function createProgressAction(data: { weightKg?: number; waistCm?: number; notes?: string }) {
  const { sub: userId } = await requireUser();
  return repo.create(userId, data);
}

/** Server Action: delete a progress entry by ID. */
export async function deleteProgressAction(id: string) {
  return repo.remove(id);
}
