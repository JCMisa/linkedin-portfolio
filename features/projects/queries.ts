import "server-only";
import { db } from "@/db";
import { withErrorHandling } from "@/lib/utils";
import { Comments, Likes, Projects, Users } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";

export const getAllProjects = withErrorHandling(async () => {
  const data = await db
    .select()
    .from(Projects)
    .orderBy(desc(Projects.createdAt));

  return data?.length > 0
    ? { data, success: true }
    : { data: null, success: false };
});

export const getProjectById = withErrorHandling(async (projectId: string) => {
  const data = await db
    .select()
    .from(Projects)
    .where(eq(Projects.id, projectId))
    .limit(1);

  return data.length > 0
    ? { data: data[0], success: true }
    : { data: null, success: false };
});

/** Public aggregate used by the profile stats. */
export const getLikeCount = async () => {
  const [row] = await db.select({ value: count() }).from(Likes);
  return row?.value ?? 0;
};

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

/** Public aggregate used by the profile stats. */
export const getCommentCount = async () => {
  const [row] = await db.select({ value: count() }).from(Comments);
  return row?.value ?? 0;
};
