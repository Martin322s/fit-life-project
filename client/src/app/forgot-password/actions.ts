"use server";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://fit-life-api.netlify.app"
    : (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001");

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
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmed }),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      return {
        success: false,
        message: body.message ?? "Нещо се обърка. Опитай отново.",
      };
    }

    return { success: true };
  } catch {
    return { success: false, message: "Мрежова грешка. Опитай отново." };
  }
}
