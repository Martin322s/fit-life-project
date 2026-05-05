const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export type ContactInput = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  privacyConsent: boolean;
};

export async function sendContactMessage(input: ContactInput): Promise<{ message: string }> {
  const res = await fetch(`${BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? "Грешка при изпращане на съобщението.");
  }

  return res.json() as Promise<{ message: string }>;
}
