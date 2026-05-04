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

  const APP_URL = process.env.APP_URL ?? "http://localhost:5173";
  const resetUrl = `${APP_URL}/reset-password?token=${plainToken}`;

  console.log(`\n[DEV] Password reset link for ${email}:\n${resetUrl}\n`);

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
