import { eq, sql, and, gt } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import type { DbUser, NewDbUser } from "../db/schema";

export type UserRole = "user" | "admin";
export type User = DbUser;
export type PublicUser = Omit<User, "passwordHash" | "passwordResetTokenHash" | "passwordResetExpiresAt">;

export async function findByEmail(email: string): Promise<User | undefined> {
  const rows = await db
    .select()
    .from(users)
    .where(sql`lower(${users.email}) = ${email.toLowerCase()}`)
    .limit(1);
  return rows[0];
}

export async function findById(id: string): Promise<User | undefined> {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0];
}

export async function emailExists(email: string): Promise<boolean> {
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(sql`lower(${users.email}) = ${email.toLowerCase()}`)
    .limit(1);
  return rows.length > 0;
}

export async function insertUser(data: NewDbUser): Promise<User> {
  const rows = await db
    .insert(users)
    .values({ ...data, email: data.email.toLowerCase() })
    .returning();
  return rows[0];
}

export async function setResetToken(
  userId: string,
  tokenHash: string,
  expiresAt: Date,
): Promise<void> {
  await db
    .update(users)
    .set({ passwordResetTokenHash: tokenHash, passwordResetExpiresAt: expiresAt, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

export async function findByResetTokenHash(tokenHash: string): Promise<User | undefined> {
  const rows = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.passwordResetTokenHash, tokenHash),
        gt(users.passwordResetExpiresAt, new Date()),
      ),
    )
    .limit(1);
  return rows[0];
}

export async function updatePasswordAndClearReset(
  userId: string,
  newPasswordHash: string,
): Promise<void> {
  await db
    .update(users)
    .set({
      passwordHash: newPasswordHash,
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

export function toPublic(user: User): PublicUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _ph, passwordResetTokenHash: _rt, passwordResetExpiresAt: _re, ...pub } = user;
  return pub;
}
