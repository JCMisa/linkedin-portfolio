import "server-only";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as tables from "./schema";
import * as relations from "./relations";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({
  client: sql,
  schema: { ...tables, ...relations },
  casing: "camelCase",
});
