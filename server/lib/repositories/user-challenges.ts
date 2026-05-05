import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { challenges, userChallenges } from "../../db/schema";
import type { DbChallenge, DbUserChallenge, UserChallengeStatus } from "../../db/schema";

export type UserChallengeWithChallenge = DbUserChallenge & {
  challenge: DbChallenge;
};

export type CreateUserChallengeInput = {
  challengeId: string;
};

export type UpdateUserChallengeInput = {
  progressValue?: number;
  status?: UserChallengeStatus;
  completedAt?: Date | null;
};

function mapJoinedRow(row: {
  user_challenges: DbUserChallenge;
  challenges: DbChallenge;
}): UserChallengeWithChallenge {
  return {
    ...row.user_challenges,
    challenge: row.challenges,
  };
}

export async function listByUser(userId: string): Promise<UserChallengeWithChallenge[]> {
  const rows = await db
    .select({ user_challenges: userChallenges, challenges })
    .from(userChallenges)
    .innerJoin(challenges, eq(userChallenges.challengeId, challenges.id))
    .where(eq(userChallenges.userId, userId))
    .orderBy(desc(userChallenges.createdAt));

  return rows.map(mapJoinedRow);
}

export async function listAll(): Promise<UserChallengeWithChallenge[]> {
  const rows = await db
    .select({ user_challenges: userChallenges, challenges })
    .from(userChallenges)
    .innerJoin(challenges, eq(userChallenges.challengeId, challenges.id))
    .orderBy(desc(userChallenges.createdAt));

  return rows.map(mapJoinedRow);
}

export async function findById(id: string): Promise<DbUserChallenge | undefined> {
  const rows = await db.select().from(userChallenges).where(eq(userChallenges.id, id)).limit(1);
  return rows[0];
}

export async function findWithChallengeById(id: string): Promise<UserChallengeWithChallenge | undefined> {
  const rows = await db
    .select({ user_challenges: userChallenges, challenges })
    .from(userChallenges)
    .innerJoin(challenges, eq(userChallenges.challengeId, challenges.id))
    .where(eq(userChallenges.id, id))
    .limit(1);

  if (!rows[0]) return undefined;
  return mapJoinedRow(rows[0]);
}

export async function findActiveByUserAndChallenge(userId: string, challengeId: string): Promise<DbUserChallenge | undefined> {
  const rows = await db
    .select()
    .from(userChallenges)
    .where(and(eq(userChallenges.userId, userId), eq(userChallenges.challengeId, challengeId), eq(userChallenges.status, "active")))
    .limit(1);

  return rows[0];
}

export async function create(userId: string, data: CreateUserChallengeInput): Promise<DbUserChallenge> {
  const rows = await db
    .insert(userChallenges)
    .values({
      userId,
      challengeId: data.challengeId,
      status: "active",
      progressValue: 0,
      startedAt: new Date(),
    })
    .returning();

  return rows[0];
}

export async function update(id: string, data: UpdateUserChallengeInput): Promise<DbUserChallenge | undefined> {
  if (Object.keys(data).length === 0) return findById(id);

  const rows = await db
    .update(userChallenges)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(userChallenges.id, id))
    .returning();

  return rows[0];
}

export async function remove(id: string): Promise<boolean> {
  const rows = await db.delete(userChallenges).where(eq(userChallenges.id, id)).returning({ id: userChallenges.id });
  return rows.length > 0;
}
