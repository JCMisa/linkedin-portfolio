import "server-only";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { Users, type UsersType } from "@/db/schema";

/**
 * Server-only auth helpers. This file is intentionally NOT a "use server"
 * module, so none of these functions are exposed as callable server actions.
 */

const ADMIN_ROLES = new Set(["admin", "owner"]);

export const isAdminRole = (role: string | null | undefined): boolean =>
  !!role && ADMIN_ROLES.has(role);

/** Returns the signed-in user's DB record, or null. Never throws. */
export async function getSessionUser(): Promise<UsersType | null> {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const [user] = await db
      .select()
      .from(Users)
      .where(eq(Users.userId, userId))
      .limit(1);

    return user ?? null;
  } catch {
    return null;
  }
}

/** Throws unless a user is signed in and exists in the DB. */
export async function requireUser(): Promise<UsersType> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

/** Throws unless the signed-in user has an admin/owner role. */
export async function requireAdmin(): Promise<UsersType> {
  const user = await requireUser();
  if (!isAdminRole(user.role)) throw new Error("Forbidden");
  return user;
}
