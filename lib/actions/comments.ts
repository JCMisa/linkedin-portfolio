"use server";

import { db } from "@/config/db";
import { withErrorHandling } from "../utils";
import { Comments, Users } from "@/config/schema";
import { count, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isAdminRole, requireUser } from "@/lib/auth";

/** Public aggregate used by the profile stats. */
export const getCommentCount = async () => {
  const [row] = await db.select({ value: count() }).from(Comments);
  return row?.value ?? 0;
};

export const createComment = withErrorHandling(
  async (projectId: string, content: string) => {
    const user = await requireUser();

    const [newComment] = await db
      .insert(Comments)
      .values({
        content,
        projectId,
        userId: user.id,
      })
      .returning({
        id: Comments.id,
        content: Comments.content,
        createdAt: Comments.createdAt,
        userId: Comments.userId,
      });

    revalidatePath("/");
    return { data: newComment, success: true };
  },
);

export const deleteComment = withErrorHandling(async (commentId: string) => {
  const user = await requireUser();

  const [comment] = await db
    .select({ userId: Comments.userId })
    .from(Comments)
    .where(eq(Comments.id, commentId))
    .limit(1);

  // Only the author (or an admin) may delete a comment
  if (!comment || (comment.userId !== user.id && !isAdminRole(user.role))) {
    return { data: null, success: false, error: "Unauthorized" };
  }

  await db.delete(Comments).where(eq(Comments.id, commentId));

  revalidatePath("/");
  return { data: null, success: true };
});

export const getProjectComments = withErrorHandling(
  async (projectId: string) => {
    const comments = await db
      .select({
        id: Comments.id,
        content: Comments.content,
        createdAt: Comments.createdAt,
        user: {
          id: Users.id,
          name: Users.name,
          image: Users.image,
          role: Users.role,
        },
      })
      .from(Comments)
      .leftJoin(Users, eq(Comments.userId, Users.id))
      .where(eq(Comments.projectId, projectId))
      .orderBy(desc(Comments.createdAt));

    return { data: comments, success: true };
  },
);
