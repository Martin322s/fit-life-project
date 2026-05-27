import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SUCCESS_MSG = "Съобщението е изпратено успешно.";

type ContactBody = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  privacyConsent?: unknown;
};

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

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

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

async function sendEmail(params: EmailJsPayload["template_params"]): Promise<void> {
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
    throw new Error(`contact_emailjs_failed:${response.status}:${details}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as ContactBody | null;
    if (!body) {
      return NextResponse.json({ message: "Невалидна заявка." }, { status: 400 });
    }

    const firstName = asText(body.firstName);
    const lastName = asText(body.lastName);
    const email = asText(body.email).toLowerCase();
    const subject = asText(body.subject);
    const message = asText(body.message);

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json({ message: "Всички полета са задължителни." }, { status: 400 });
    }

    if (!isEmail(email)) {
      return NextResponse.json({ message: "Имейл адресът е невалиден." }, { status: 400 });
    }

    if (message.length > 1000) {
      return NextResponse.json({ message: "Съобщението не може да е над 1000 символа." }, { status: 400 });
    }

    if (body.privacyConsent !== true) {
      return NextResponse.json({ message: "Необходимо е съгласие с политиката за поверителност." }, { status: 400 });
    }

    await sendEmail({
      to_email: process.env.CONTACT_TO_EMAIL ?? "m.sofroniev12@gmail.com",
      from_email: email,
      email,
      name: `${firstName} ${lastName}`.trim(),
      title: subjectTitle(subject),
      message,
    });

    return NextResponse.json({ message: SUCCESS_MSG }, { status: 200 });
  } catch (err) {
    console.error("POST /api/contact", err);
    return NextResponse.json({ message: "Сървърна грешка. Опитай отново." }, { status: 500 });
  }
}
