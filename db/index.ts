import "server-only";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as tables from "./schema";
import * as relations from "./relations";

import { env } from "@/lib/env";
const sql = neon(env.DATABASE_URL);

export const db = drizzle({
  client: sql,
  schema: { ...tables, ...relations },
  casing: "camelCase",
});
