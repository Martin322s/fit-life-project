import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import {
  findByEmail,
  findById,
  emailExists,
  insertUser,
  toPublic,
  setResetToken,
  findByResetTokenHash,
  updatePasswordAndClearReset,
  type PublicUser,
  type UserRole,
} from "./users";
import { signToken, verifyToken, extractBearerToken, type JwtPayload } from "./jwt";

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  gender?: "male" | "female";
  age?: number;
  height?: number;
  heightUnit?: "cm" | "ft";
  weight?: number;
  weightUnit?: "kg" | "lb";
  goal?: "lose" | "maintain" | "gain";
  activity?: "sedentary" | "light" | "moderate" | "very";
};

function toHeightCm(height?: number, unit?: "cm" | "ft"): number | null {
  if (height == null || Number.isNaN(height)) return null;
  return unit === "ft" ? +(height * 30.48).toFixed(1) : height;
}

function toGoalType(goal?: "lose" | "maintain" | "gain"): "lose_weight" | "maintain" | "gain_weight" | null {
  if (goal === "lose") return "lose_weight";
  if (goal === "maintain") return "maintain";
  if (goal === "gain") return "gain_weight";
  return null;
}

export type AuthResult = {
  user: PublicUser;
  token: string;
};

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await findByEmail(input.email);
  if (!user) throw new Error("invalid_credentials");

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw new Error("invalid_credentials");

  const token = signToken({
    sub: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });

  return { user: toPublic(user), token };
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  if (await emailExists(input.email)) throw new Error("email_taken");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const heightCm = toHeightCm(input.height, input.heightUnit);
  const goalType = toGoalType(input.goal);

  const user = await insertUser({
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    passwordHash,
    role: input.role ?? "user",
    gender: input.gender ?? null,
    age: input.age ?? null,
    height: input.height ?? null,
    heightUnit: input.heightUnit ?? null,
    weight: input.weight ?? null,
    weightUnit: input.weightUnit ?? null,
    goal: input.goal ?? null,
    activity: input.activity ?? null,
    heightCm,
    activityLevel: input.activity ?? null,
    goalType,
  });

  const token = signToken({
    sub: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });

  return { user: toPublic(user), token };
}

export type ForgotPasswordResult = {
  /** Plain token to embed in the reset URL — only returned in development. Never send to client in prod. */
  devToken: string;
  resetUrl: string;
};

type EmailJsPayload = {
  service_id: string;
  template_id: string;
  user_id: string;
  accessToken?: string;
  template_params: {
    to_email: string;
    email: string;
    link: string;
    reset_url: string;
  };
};

async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const accessToken = process.env.EMAILJS_ACCESS_TOKEN;

  if (!serviceId || !templateId || !publicKey) {
    console.log(resetUrl);
    return;
  }

  const payload: EmailJsPayload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    ...(accessToken ? { accessToken } : {}),
    template_params: {
      to_email: email,
      email,
      link: resetUrl,
      reset_url: resetUrl,
    },
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

function getClientUrl(): string {
  const clientUrl = process.env.CLIENT_URL ?? process.env.APP_URL;
  if (clientUrl) return clientUrl.replace(/\/$/, "");
  if (process.env.NODE_ENV !== "production") return "http://localhost:5173";
  throw new Error("CLIENT_URL is not set");
}

/**
 * Generates a reset token, stores its SHA-256 hash in the DB, and returns dev info.
 * In production, remove the return value and send the URL via email instead.
 */
export async function forgotPassword(email: string): Promise<ForgotPasswordResult | null> {
  const user = await findByEmail(email);
  if (!user) return null; // silently ignore unknown emails

  const plainToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(plainToken).digest("hex");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  await setResetToken(user.id, tokenHash, expiresAt);

  const resetUrl = `${getClientUrl()}/reset-password?token=${plainToken}`;

  await sendPasswordResetEmail(user.email, resetUrl);

  return { devToken: plainToken, resetUrl };
}

export async function resetPassword(plainToken: string, newPassword: string): Promise<void> {
  const tokenHash = createHash("sha256").update(plainToken).digest("hex");
  const user = await findByResetTokenHash(tokenHash);

  if (!user) throw new Error("invalid_or_expired_token");
  if (newPassword.length < 8) throw new Error("password_too_short");

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await updatePasswordAndClearReset(user.id, passwordHash);
}

export function getUserFromToken(authHeader: string | null): JwtPayload | null {
  const token = extractBearerToken(authHeader);
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function getFullUserById(id: string): Promise<PublicUser | null> {
  const user = await findById(id);
  return user ? toPublic(user) : null;
}
