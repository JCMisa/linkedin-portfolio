"use server";

import { db } from "@/db";
import { withErrorHandling } from "@/lib/utils";
import { Likes } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

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
