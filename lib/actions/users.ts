"use server";

import { db } from "@/config/db";
import { Users } from "@/config/schema";
import { count } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth";

// --------------------------- Server Actions ---------------------------

/** The signed-in user's own record, or null when signed out. */
export const getCurrentUser = async () => getSessionUser();

export const getUserRole = async () => (await getSessionUser())?.role ?? null;

/** Public aggregate only — never expose the user list (it contains emails). */
export const getUserCount = async () => {
  const [row] = await db.select({ value: count() }).from(Users);
  return row?.value ?? 0;
};
