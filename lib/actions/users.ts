"use server";

import { db } from "@/config/db";
import { withErrorHandling } from "../utils";
import { Users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

// --------------------------- Helper Functions ---------------------------
export const getSessionUserId = async (): Promise<string> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  return userId;
};

// --------------------------- Server Actions ---------------------------
export const getAllUsers = withErrorHandling(async () => {
  const data = await db.select().from(Users);

  return data;
});

export const getCurrentUser = withErrorHandling(async () => {
  const data = await db
    .select()
    .from(Users)
    .where(eq(Users.userId, await getSessionUserId()));

  if (data.length === 0) {
    throw new Error("User not found");
  }

  return data[0];
});

export const getUserByEmail = withErrorHandling(async (email: string) => {
  const data = await db.select().from(Users).where(eq(Users.email, email));

  if (data.length === 0) {
    throw new Error("User not found");
  }

  return data[0];
});

export const getUserRole = withErrorHandling(async () => {
  const user = await getCurrentUser();

  if (!user) throw new Error("User not found");
  return user.role;
});
