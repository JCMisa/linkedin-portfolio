import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// Node >= 20.12 can load .env files natively — no dotenv needed.
// Skipped when the file is absent (e.g. CI, where env vars are injected).
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
