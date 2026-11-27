"use server";

import { and, count, eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db } from "@/db";
import { Likes } from "@/db/schema";
import { authActionClient } from "@/lib/safe-action";
import { LIKES_TAG } from "../queries";
import { projectIdSchema } from "../schemas";

/** Likes or unlikes a project for the signed-in user. Returns the new state. */
export const toggleProjectLike = authActionClient
  .inputSchema(projectIdSchema)
  .action(async ({ parsedInput: { projectId }, ctx: { user } }) => {
    const mine = and(eq(Likes.projectId, projectId), eq(Likes.userId, user.id));

    const removed = await db
      .delete(Likes)
      .where(mine)
      .returning({ id: Likes.id });
    const liked = removed.length === 0;
    if (liked) await db.insert(Likes).values({ projectId, userId: user.id });

    const [{ value: likesCount }] = await db
      .select({ value: count() })
      .from(Likes)
      .where(eq(Likes.projectId, projectId));

    updateTag(LIKES_TAG); // counts and liker lists
    return { liked, likesCount };
  });
