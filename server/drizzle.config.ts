import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

config({ path: ".env.local" });

// Node.js has no built-in WebSocket — supply one so drizzle-kit can connect.
neonConfig.webSocketConstructor = ws;

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://placeholder/placeholder",
  },
});
