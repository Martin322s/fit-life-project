"use server";

// Server Action — calls forgotPassword() from the auth lib directly (same process, no HTTP round-trip).
// The /api/auth/forgot-password REST route is preserved for the Expo mobile app.

import { forgotPassword } from "@/src/lib/server/auth";

export type ForgotPasswordActionResult =
  | { success: true }
  | { success: false; message: string };

export async function forgotPasswordAction(
  email: string,
): Promise<ForgotPasswordActionResult> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !trimmed.includes("@")) {
    return { success: false, message: "Въведи валиден имейл адрес." };
  }

  try {
    await forgotPassword(trimmed);
    return { success: true };
  } catch (err) {
    console.error("forgotPasswordAction", err);
    return { success: false, message: "Нещо се обърка. Опитай отново." };
  }
}
