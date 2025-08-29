"use server";

import { db } from "@/config/db";
import { withErrorHandling } from "../utils";
import { Likes } from "@/config/schema";
import { and, desc, eq } from "drizzle-orm";
import { getCurrentUser } from "./users";
import { revalidatePath } from "next/cache";

export const toggleProjectLike = withErrorHandling(
  async (projectId: string) => {
    const user = await getCurrentUser();

    if (!user) {
      return { data: null, success: false };
    }

    const existingLike = await db
      .select()
      .from(Likes)
      .where(and(eq(Likes.projectId, projectId), eq(Likes.userId, user.id)))
      .limit(1);

    if (existingLike.length > 0) {
      // Unlike: Delete the existing like
      const [deletedLike] = await db
        .delete(Likes)
        .where(and(eq(Likes.projectId, projectId), eq(Likes.userId, user.id)))
        .returning();

      revalidatePath("/");
      return { data: { ...deletedLike, action: "unliked" }, success: true };
    }

    // Like: Create a new like
    const [newLike] = await db
      .insert(Likes)
      .values({
        projectId,
        userId: user.id,
      })
      .returning();

    revalidatePath("/");
    return { data: { ...newLike, action: "liked" }, success: true };
  }
);

export const getProjectLikes = withErrorHandling(async (projectId: string) => {
  const user = await getCurrentUser();

  if (!user) {
    return { data: null, success: false };
  }

  const likes = await db
    .select()
    .from(Likes)
    .where(eq(Likes.projectId, projectId))
    .orderBy(desc(Likes.createdAt));

  if (!likes) {
    return { data: [], success: true };
  }

  return { data: likes, success: true };
});

export const hasUserLikedProject = withErrorHandling(
  async (projectId: string) => {
    const user = await getCurrentUser();

    if (!user) {
      return { data: false, success: false };
    }

    const like = await db
      .select()
      .from(Likes)
      .where(and(eq(Likes.projectId, projectId), eq(Likes.userId, user.id)))
      .limit(1);

    return { data: like.length > 0, success: true };
  }
);
