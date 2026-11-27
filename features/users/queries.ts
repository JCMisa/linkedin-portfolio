import "server-only";
import { db } from "@/db";
import { Users } from "@/db/schema";
import { count } from "drizzle-orm";

/** Public aggregate only — never expose the user list (it contains emails). */
export const getUserCount = async () => {
  const [row] = await db.select({ value: count() }).from(Users);
  return row?.value ?? 0;
};
