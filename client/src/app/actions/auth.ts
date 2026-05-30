"use server";

import { cookies } from "next/headers";
import { loginUser, registerUser, forgotPassword, resetPassword, type RegisterInput } from "@/src/lib/server/auth";
import { getUserFromToken, getFullUserById } from "@/src/lib/server/auth";

const TOKEN_COOKIE = "fitlife-token";

async function setCookieToken(token: string) {
  const jar = await cookies();
  jar.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/** Server Action: log in a user and set an httpOnly token cookie. */
export async function loginAction(email: string, password: string) {
  const { user, token } = await loginUser({ email, password });
  await setCookieToken(token);
  return { user, token };
}

/** Server Action: register a new user and set an httpOnly token cookie. */
export async function registerAction(input: RegisterInput) {
  const { user, token } = await registerUser(input);
  await setCookieToken(token);
  return { user, token };
}

/** Server Action: clear the auth cookie (logout). */
export async function logoutAction() {
  const jar = await cookies();
  jar.set(TOKEN_COOKIE, "", { maxAge: 0, path: "/" });
}

/** Server Action: send a password-reset email. */
export async function forgotPasswordAction(email: string) {
  await forgotPassword(email);
}

/** Server Action: reset password with the plain token from the email link. */
export async function resetPasswordAction(token: string, newPassword: string) {
  await resetPassword(token, newPassword);
}

/** Server Action: return the current user from the httpOnly cookie. */
export async function getMeAction() {
  const jar = await cookies();
  const token = jar.get(TOKEN_COOKIE)?.value ?? null;
  const payload = getUserFromToken(token ? `Bearer ${token}` : null);
  if (!payload) return null;
  return getFullUserById(payload.sub);
}
