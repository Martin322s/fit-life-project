import { config } from "dotenv";
config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { sql } from "drizzle-orm";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set in .env.local");

const db = drizzle(neon(url), { schema });

const DEMO_USERS = [
  {
    email: "user@fitlife.bg",
    firstName: "Иван",
    lastName: "Иванов",
    password: "password123",
    role: "user" as const,
  },
  {
    email: "admin@fitlife.bg",
    firstName: "Админ",
    lastName: "Петров",
    password: "admin1234",
    role: "admin" as const,
  },
];

async function seed() {
  console.log("Seeding demo users...");

  for (const u of DEMO_USERS) {
    const exists = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(sql`lower(${schema.users.email}) = ${u.email.toLowerCase()}`)
      .limit(1);

    if (exists.length > 0) {
      console.log(`  skipped ${u.email} (already exists)`);
      continue;
    }

    const passwordHash = await bcrypt.hash(u.password, 12);
    await db.insert(schema.users).values({
      email: u.email.toLowerCase(),
      firstName: u.firstName,
      lastName: u.lastName,
      passwordHash,
      role: u.role,
    });
    console.log(`  created ${u.email} (${u.role})`);
  }

  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
