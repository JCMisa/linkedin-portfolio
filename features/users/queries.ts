import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { Users } from "@/db/schema";
import { count } from "drizzle-orm";

/**
 * Cache tag for reads that include user rows (member count, liker/commenter
 * names). The Clerk webhook expires it with revalidateTag(USERS_TAG, "max").
 */
export const USERS_TAG = "users";

/** Public aggregate only — never expose the user list (it contains emails). */
export async function getUserCount() {
  "use cache";
  cacheTag(USERS_TAG);
  cacheLife("hours");
  const [row] = await db.select({ value: count() }).from(Users);
  return row?.value ?? 0;
}
