"use server";

import { db } from "@/config/db";
import { withErrorHandling } from "../utils";
import { Comments, Likes, Projects, Users } from "@/config/schema";
import { getCurrentUser } from "./users";
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  lt,
  or,
} from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { deleteImageFromCloudinary } from "../cloudinary";

export const getAllProjects = withErrorHandling(async () => {
  const user = await getCurrentUser();
  if (!user) return { data: null, success: false };

  const data = await db
    .select()
    .from(Projects)
    .orderBy(desc(Projects.createdAt));

  return data?.length > 0
    ? { data, success: true }
    : { data: null, success: false };
});

export const addProject = withErrorHandling(
  async (projectData: ProjectInsertedDataType, techStacks: string[]) => {
    const user = await getCurrentUser();
    if (!user) return { data: null, success: false };

    const [data] = await db
      .insert(Projects)
      .values({
        title: projectData.title,
        description: projectData.description,
        image: projectData.imageUrl,
        githubLink: projectData.githubUrl,
        liveLink: projectData.liveUrl,
        techStacks,
        category: projectData.category,
      })
      .returning({ insertedProjectTitle: Projects.title });

    if (data?.insertedProjectTitle) {
      revalidatePath("/");
      return { data: data.insertedProjectTitle, success: true };
    }
    return { data: null, success: false };
  },
);

export const updateProject = withErrorHandling(
  async (
    projectId: string,
    projectData: Partial<ProjectInsertedDataType>,
    techStacks: string[],
  ) => {
    const user = await getCurrentUser();
    if (!user) return { data: null, success: false, error: "Unauthorized" };

    const [currentProject] = await db
      .select()
      .from(Projects)
      .where(eq(Projects.id, projectId))
      .limit(1);

    if (!currentProject)
      return { data: null, success: false, error: "Project not found" };

    if (
      projectData.imageUrl &&
      projectData.imageUrl !== currentProject.image &&
      currentProject.image
    ) {
      try {
        await deleteImageFromCloudinary(currentProject.image);
      } catch (error) {
        console.error("Error deleting old image from Cloudinary:", error);
      }
    }

    const [data] = await db
      .update(Projects)
      .set({
        title: projectData.title,
        description: projectData.description,
        image: projectData.imageUrl,
        githubLink: projectData.githubUrl,
        liveLink: projectData.liveUrl,
        techStacks,
        category: projectData.category,
        updatedAt: new Date(),
      })
      .where(eq(Projects.id, projectId))
      .returning({ updatedProjectTitle: Projects.title });

    if (data?.updatedProjectTitle) {
      revalidatePath("/");
      return { data: data.updatedProjectTitle, success: true };
    }
    return { data: null, success: false, error: "Failed to update project" };
  },
);

export const deleteProject = withErrorHandling(async (projectId: string) => {
  const user = await getCurrentUser();
  if (!user) return { data: null, success: false };

  const [project] = await db
    .select()
    .from(Projects)
    .where(eq(Projects.id, projectId))
    .limit(1);

  if (!project)
    return { data: null, success: false, error: "Project not found" };

  if (project.image) {
    try {
      await deleteImageFromCloudinary(project.image);
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  }

  const data = await db.delete(Projects).where(eq(Projects.id, projectId));

  if (data) {
    revalidatePath("/");
    return { data: null, success: true };
  }
  return { data: null, success: false };
});

export const getFilteredProjects = withErrorHandling(
  async ({
    query,
    category,
  }: { query?: string; category?: string | null } = {}) => {
    const user = await getCurrentUser();
    if (!user) return { data: [], success: false };

    const conditions = [];

    if (query?.trim()) {
      const like = `%${query.trim()}%`;
      conditions.push(
        or(ilike(Projects.title, like), ilike(Projects.description, like)),
      );
    }
    if (category) {
      conditions.push(eq(Projects.category, category));
    }

    const rows = await db
      .select()
      .from(Projects)
      .where(and(...conditions))
      .orderBy(desc(Projects.createdAt));

    return { data: rows, success: true };
  },
);

export const getProjectsPaginated = withErrorHandling(
  async ({
    query,
    category,
    cursor,
    limit = 5,
  }: {
    query?: string;
    category?: string | null;
    cursor?: string;
    limit?: number;
  } = {}) => {
    // 1. Silent Auth (Same as before)
    let currentUserDbId: number | null = null;
    try {
      const user = await getCurrentUser();
      if (user && typeof user === "object" && "id" in user) {
        currentUserDbId = (user as { id: number }).id;
      }
    } catch {
      currentUserDbId = null;
    }

    // 2. Define Count Subqueries
    // These create "Virtual Tables" that pre-calculate counts
    const likesSub = db
      .select({
        projectId: Likes.projectId,
        count: count(Likes.id).as("l_count"),
      })
      .from(Likes)
      .groupBy(Likes.projectId)
      .as("likes_sub");

    const commentsSub = db
      .select({
        projectId: Comments.projectId,
        count: count(Comments.id).as("c_count"),
      })
      .from(Comments)
      .groupBy(Comments.projectId)
      .as("comments_sub");

    // 3. Build Main Query
    let q = db
      .select({
        ...getTableColumns(Projects),
        likesCount: likesSub.count,
        commentsCount: commentsSub.count,
      })
      .from(Projects)
      .leftJoin(likesSub, eq(Projects.id, likesSub.projectId))
      .leftJoin(commentsSub, eq(Projects.id, commentsSub.projectId))
      .orderBy(desc(Projects.createdAt), desc(Projects.id))
      .$dynamic();

    // 4. Apply Filters
    const conditions = [];
    if (query?.trim()) {
      const search = `%${query.trim()}%`;
      conditions.push(
        or(ilike(Projects.title, search), ilike(Projects.description, search)),
      );
    }
    if (category) conditions.push(eq(Projects.category, category));
    if (cursor) {
      const [ts, id] = cursor.split("|");
      const cursorDate = new Date(ts);
      if (!isNaN(cursorDate.getTime())) {
        conditions.push(
          or(
            lt(Projects.createdAt, cursorDate),
            and(eq(Projects.createdAt, cursorDate), lt(Projects.id, id)),
          ),
        );
      }
    }
    if (conditions.length > 0) q = q.where(and(...conditions));

    const rows = await q.limit(limit + 1);

    // 5. Enrich with "hasLiked" and "latestCommenter"
    // We do this in a loop for the 5-6 items found. This is very efficient.
    const enrichedData = await Promise.all(
      rows.map(async (row) => {
        // Check if current user liked this specific project
        let hasLiked = false;
        if (currentUserDbId) {
          const likeCheck = await db
            .select({ id: Likes.id })
            .from(Likes)
            .where(
              and(
                eq(Likes.projectId, row.id),
                eq(Likes.userId, currentUserDbId),
              ),
            )
            .limit(1);
          hasLiked = likeCheck.length > 0;
        }

        // Get the latest commenter
        const latestComment = await db
          .select({ name: Users.name, image: Users.image })
          .from(Comments)
          .innerJoin(Users, eq(Comments.userId, Users.id))
          .where(eq(Comments.projectId, row.id))
          .orderBy(desc(Comments.createdAt))
          .limit(1);

        return {
          ...row,
          likesCount: Number(row.likesCount ?? 0),
          commentsCount: Number(row.commentsCount ?? 0),
          hasLiked,
          latestCommenter: latestComment[0] ?? null,
        };
      }),
    );

    const hasMore = enrichedData.length > limit;
    const data = hasMore ? enrichedData.slice(0, limit) : enrichedData;

    const nextCursor =
      hasMore && data.length > 0
        ? `${data[data.length - 1].createdAt.toISOString()}|${data[data.length - 1].id}`
        : null;

    return { data, nextCursor, success: true };
  },
);

export const getProjectById = withErrorHandling(async (projectId: string) => {
  const user = await getCurrentUser();
  if (!user) return { data: null, success: false };

  const data = await db
    .select()
    .from(Projects)
    .where(eq(Projects.id, projectId))
    .limit(1);

  return data.length > 0
    ? { data: data[0], success: true }
    : { data: null, success: false };
});
