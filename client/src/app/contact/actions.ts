"use server";

// Server Action — calls EmailJS directly (same process, no HTTP round-trip).
// The /api/contact REST route is preserved for the Expo mobile app.

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

type EmailJsPayload = {
  service_id: string;
  template_id: string;
  user_id: string;
  accessToken?: string;
  template_params: {
    to_email: string;
    from_email: string;
    email: string;
    name: string;
    title: string;
    message: string;
  };
};

function subjectTitle(subject: string): string {
  const titles: Record<string, string> = {
    technical: "Технически проблем",
    account: "Въпрос за акаунт",
    data: "Данни и поверителност",
    feedback: "Предложение за подобрение",
    bug: "Докладване на грешка",
    feature: "Заявка за функция",
    press: "Медии и партньорства",
    other: "Друго",
  };
  return titles[subject] ?? subject;
}

async function sendEmailJs(params: EmailJsPayload["template_params"]): Promise<void> {
  const serviceId = process.env.CONTACT_EMAILJS_SERVICE_ID ?? process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.CONTACT_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.CONTACT_EMAILJS_PUBLIC_KEY ?? process.env.EMAILJS_PUBLIC_KEY;
  const accessToken = process.env.CONTACT_EMAILJS_ACCESS_TOKEN ?? process.env.EMAILJS_ACCESS_TOKEN;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("contact_emailjs_not_configured");
  }

  const payload: EmailJsPayload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    ...(accessToken ? { accessToken } : {}),
    template_params: params,
  };

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`emailjs_failed:${response.status}:${details}`);
  }
}

export async function sendContactAction(
  input: ContactActionInput,
): Promise<ContactActionResult> {
  if (!input.firstName || !input.lastName || !input.email || !input.subject || !input.message) {
    return { success: false, message: "Всички полета са задължителни." };
  }
  if (!input.privacyConsent) {
    return { success: false, message: "Трябва да се съгласиш с Политиката за поверителност." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { success: false, message: "Имейл адресът е невалиден." };
  }
  if (input.message.length > 1000) {
    return { success: false, message: "Съобщението не може да е над 1000 символа." };
  }

  try {
    await sendEmailJs({
      to_email: process.env.CONTACT_TO_EMAIL ?? "m.sofroniev12@gmail.com",
      from_email: input.email.toLowerCase(),
      email: input.email.toLowerCase(),
      name: `${input.firstName} ${input.lastName}`.trim(),
      title: subjectTitle(input.subject),
      message: input.message,
    });
    return { success: true };
  } catch (err) {
    console.error("sendContactAction", err);
    return { success: false, message: "Сървърна грешка. Опитай отново." };
  }
}
