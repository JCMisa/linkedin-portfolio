"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { Comments } from "@/db/schema";
import { isAdminRole } from "@/lib/auth";
import { ActionError } from "@/lib/errors";
import { authActionClient } from "@/lib/safe-action";
import { commentIdSchema, createCommentSchema } from "../schemas";

export const createComment = authActionClient
  .inputSchema(createCommentSchema)
  .action(async ({ parsedInput: { projectId, content }, ctx: { user } }) => {
    const [comment] = await db
      .insert(Comments)
      .values({ projectId, content, userId: user.id })
      .returning({ id: Comments.id });

    revalidatePath("/", "layout");
    return comment;
  });

/** Only the comment's author or an admin may delete it. */
export const deleteComment = authActionClient
  .inputSchema(commentIdSchema)
  .action(async ({ parsedInput: { commentId }, ctx: { user } }) => {
    const [comment] = await db
      .select({ userId: Comments.userId })
      .from(Comments)
      .where(eq(Comments.id, commentId))
      .limit(1);

    if (!comment) throw new ActionError("Comment not found.");
    if (comment.userId !== user.id && !isAdminRole(user.role)) {
      throw new ActionError("You can only delete your own comments.");
    }

    await db.delete(Comments).where(eq(Comments.id, commentId));
    revalidatePath("/", "layout");
    return { id: commentId };
  });
