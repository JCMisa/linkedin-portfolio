"use server";

import { db } from "@/config/db";
import { withErrorHandling } from "../utils";
import { Comments, Users } from "@/config/schema";
import { desc, eq } from "drizzle-orm";
import { getCurrentUser } from "./users";
import { revalidatePath } from "next/cache";

export const getAllComments = withErrorHandling(async () => {
  const user = await getCurrentUser();

  if (!user) {
    return { data: null, success: false };
  }

  const comments = await db.select().from(Comments);

  return { data: comments, success: true };
});

export const createComment = withErrorHandling(
  async (projectId: string, content: string) => {
    const user = await getCurrentUser();

    if (!user) {
      return { data: null, success: false, error: "Unauthorized" };
    }

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
  }
);

export const deleteComment = withErrorHandling(async (commentId: string) => {
  const user = await getCurrentUser();

  if (!user) {
    return { data: null, success: false, error: "Unauthorized" };
  }

  // First check if the comment belongs to the user
  const comment = await db
    .select()
    .from(Comments)
    .where(eq(Comments.id, commentId))
    .limit(1);

  if (!comment.length || comment[0].userId !== user.id) {
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
  }
);
