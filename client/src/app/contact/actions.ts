"use server";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://fit-life-api.netlify.app"
    : (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001");

export type ContactActionInput = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  privacyConsent: boolean;
};

export type ContactActionResult =
  | { success: true }
  | { success: false; message: string };

export async function sendContactAction(
  input: ContactActionInput,
): Promise<ContactActionResult> {
  if (!input.firstName || !input.lastName || !input.email || !input.subject || !input.message) {
    return { success: false, message: "Всички полета са задължителни." };
  }
  if (!input.privacyConsent) {
    return { success: false, message: "Трябва да се съгласиш с Политиката за поверителност." };
  }

  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      return {
        success: false,
        message: body.message ?? "Грешка при изпращане на съобщението.",
      };
    }

    return { success: true };
  } catch {
    return { success: false, message: "Мрежова грешка. Опитай отново." };
  }
}
