"use server";

import { db } from "@/config/db";
import { withErrorHandling } from "../utils";
import { Projects } from "@/config/schema";
import { getCurrentUser } from "./users";
import { and, desc, eq, ilike, lt, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getAllProjects = withErrorHandling(async () => {
  const user = await getCurrentUser();

  if (!user) {
    return { data: null, success: false };
  }

  const data = await db
    .select()
    .from(Projects)
    .orderBy(desc(Projects.createdAt));

  if (data && data.length > 0) {
    return { data: data, success: true };
  }
  return { data: null, success: false };
});

export const addProject = withErrorHandling(
  async (projectData: ProjectInsertedDataType, techStacks: string[]) => {
    const user = await getCurrentUser();

    if (!user) {
      return { data: null, success: false };
    }

    const [data] = await db
      .insert(Projects)
      .values({
        title: projectData.title,
        description: projectData.description,
        image: projectData.imageUrl,
        githubLink: projectData.githubUrl,
        liveLink: projectData.liveUrl,
        techStacks: techStacks,
        category: projectData.category,
      })
      .returning({ insertedProjectTitle: Projects.title });

    if (data && data.insertedProjectTitle) {
      revalidatePath("/");
      return { data: data.insertedProjectTitle, success: true };
    }
    return { data: null, success: false };
  }
);

export const updateProject = withErrorHandling(
  async (
    projectId: string,
    projectData: Partial<ProjectInsertedDataType>, // used partial to update only the fields that are passed. Helps in performance optimization
    techStacks: string[]
  ) => {
    const user = await getCurrentUser();

    if (!user) {
      return { data: null, success: false, error: "Unauthorized" };
    }

    const [data] = await db
      .update(Projects)
      .set({
        title: projectData.title,
        description: projectData.description,
        image: projectData.imageUrl,
        githubLink: projectData.githubUrl,
        liveLink: projectData.liveUrl,
        techStacks: techStacks,
        category: projectData.category,
        updatedAt: new Date(),
      })
      .where(eq(Projects.id, projectId))
      .returning({ updatedProjectTitle: Projects.title });

    if (data && data.updatedProjectTitle) {
      revalidatePath("/");
      return { data: data.updatedProjectTitle, success: true };
    }
    return { data: null, success: false, error: "Failed to update project" };
  }
);

export const deleteProject = withErrorHandling(async (projectId: string) => {
  const user = await getCurrentUser();

  if (!user) {
    return { data: null, success: false };
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

    let q = db
      .select()
      .from(Projects)
      .orderBy(desc(Projects.createdAt))
      .$dynamic();

    if (query?.trim()) {
      const like = `%${query.trim()}%`;
      q = q.where(
        or(ilike(Projects.title, like), ilike(Projects.description, like))
      );
    }

    if (category) {
      q = q.where(eq(Projects.category, category));
    }

    const rows = await q;
    return { data: rows, success: true };
  }
);

export const getProjectsPaginated = withErrorHandling(
  async ({
    query,
    category,
    cursor, // string: "ts|id"
    limit = 5,
  }: {
    query?: string;
    category?: string | null;
    cursor?: string;
    limit?: number;
  }) => {
    const user = await getCurrentUser();
    if (!user) return { data: [], nextCursor: null, success: false };

    // deterministic order
    let q = db
      .select()
      .from(Projects)
      .orderBy(desc(Projects.createdAt), desc(Projects.id))
      .$dynamic();

    // filters
    if (query?.trim()) {
      const like = `%${query.trim()}%`;
      q = q.where(
        or(ilike(Projects.title, like), ilike(Projects.description, like))
      );
    }
    if (category) q = q.where(eq(Projects.category, category));

    // cursor
    if (cursor) {
      const [ts, id] = cursor.split("|");
      const cursorDate = new Date(ts); // ← turn string → Date
      q = q.where(
        or(
          lt(Projects.createdAt, cursorDate),
          and(eq(Projects.createdAt, cursorDate), lt(Projects.id, id))
        )
      );
    }

    const rows = await q.limit(limit + 1);
    const hasMore = rows.length > limit;
    const data = hasMore ? rows.slice(0, limit) : rows;

    // identify what is the next project to show based on the last project id and createdAt properties
    const nextCursor = hasMore
      ? `${data[data.length - 1].createdAt.toISOString()}|${
          data[data.length - 1].id
        }`
      : null;

    return { data, nextCursor, success: true };
  }
);
