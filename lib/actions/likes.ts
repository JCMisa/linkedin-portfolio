"use server";

import { db } from "@/config/db";
import { withErrorHandling } from "../utils";
import { Likes, Users } from "@/config/schema";
import { and, count, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

/** Public aggregate used by the profile stats. */
export const getLikeCount = async () => {
  const [row] = await db.select({ value: count() }).from(Likes);
  return row?.value ?? 0;
};

export const toggleProjectLike = withErrorHandling(
  async (projectId: string) => {
    const user = await requireUser();

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
  },
);

export const getProjectLikesWithUserDetails = withErrorHandling(
  async (projectId: string) => {
    const likes = await db
      .select({
        userId: Users.id,
        userName: Users.name,
        userImage: Users.image,
        userRole: Users.role,
        likedAt: Likes.createdAt,
      })
      .from(Likes)
      .leftJoin(Users, eq(Likes.userId, Users.id))
      .where(eq(Likes.projectId, projectId))
      .orderBy(desc(Likes.createdAt));

    return { data: likes ?? [], success: true };
  },
);
