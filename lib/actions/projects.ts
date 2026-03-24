"use server";

import { db } from "@/config/db";
import { withErrorHandling } from "../utils";
import { Comments, Likes, Projects, Users } from "@/config/schema";
import { getCurrentUser } from "./users";
import { and, desc, eq, ilike, lt, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { deleteImageFromCloudinary } from "../cloudinary";

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
  },
);

export const updateProject = withErrorHandling(
  async (
    projectId: string,
    projectData: Partial<ProjectInsertedDataType>, // used partial to update only the fields that are passed. Helps in performance optimization
    techStacks: string[],
  ) => {
    const user = await getCurrentUser();

    if (!user) {
      return { data: null, success: false, error: "Unauthorized" };
    }

    // Get the current project to check if image is being changed
    const [currentProject] = await db
      .select()
      .from(Projects)
      .where(eq(Projects.id, projectId))
      .limit(1);

    if (!currentProject) {
      return { data: null, success: false, error: "Project not found" };
    }

    // If image URL is being updated and it's different from the current one,
    // delete the old image from Cloudinary
    if (
      projectData.imageUrl &&
      projectData.imageUrl !== currentProject.image &&
      currentProject.image
    ) {
      try {
        await deleteImageFromCloudinary(currentProject.image);
        // Note: We don't fail the update if Cloudinary deletion fails
        // The project will still be updated with the new image
      } catch (error) {
        console.error("Error deleting old image from Cloudinary:", error);
        // Continue with project update even if old image deletion fails
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
  },
);

export const deleteProject = withErrorHandling(async (projectId: string) => {
  const user = await getCurrentUser();

  if (!user) {
    return { data: null, success: false };
  }

  // First, get the project to retrieve the image URL
  const [project] = await db
    .select()
    .from(Projects)
    .where(eq(Projects.id, projectId))
    .limit(1);

  if (!project) {
    return { data: null, success: false, error: "Project not found" };
  }

  // Delete the image from Cloudinary if it exists
  if (project.image) {
    try {
      await deleteImageFromCloudinary(project.image);
      // Note: We don't fail the deletion if Cloudinary deletion fails
      // The project will still be deleted from the database
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      // Continue with project deletion even if image deletion fails
    }
  }

  // Delete the project from the database
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
        or(ilike(Projects.title, like), ilike(Projects.description, like)),
      );
    }

    if (category) {
      q = q.where(eq(Projects.category, category));
    }

    const rows = await q;
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
  }) => {
    // 1. SILENT AUTH CHECK
    // We try to get the user to see if they've 'liked' a project.
    // If they aren't logged in, we set user to null instead of crashing/returning.
    let user = null;
    try {
      user = await getCurrentUser();
    } catch (e) {
      user = null; // Public guest visitor
    }

    // 2. THE BIG QUERY
    // Instead of just getting projects, we use "Subqueries" (the sql`` parts).
    // This asks the database to calculate counts and info in one single trip.
    let q = db
      .select({
        // Standard Project Fields
        id: Projects.id,
        title: Projects.title,
        description: Projects.description,
        image: Projects.image,
        githubLink: Projects.githubLink,
        liveLink: Projects.liveLink,
        techStacks: Projects.techStacks,
        category: Projects.category,
        createdAt: Projects.createdAt,
        updatedAt: Projects.updatedAt,

        // LIKES COUNT: Count all rows in the 'likes' table for this project ID
        likesCount: sql<number>`
          (SELECT count(*) FROM ${Likes} WHERE ${Likes.projectId} = ${Projects.id})
        `.mapWith(Number),

        // HAS LIKED: Check if the current logged-in user's ID exists in the likes table
        hasLiked: user?.id
          ? sql<boolean>`EXISTS(SELECT 1 FROM ${Likes} WHERE ${Likes.projectId} = ${Projects.id} AND ${Likes.userId} = ${user.id})`
          : sql<boolean>`false`,

        // COMMENTS COUNT: Count all rows in the 'comments' table for this project ID
        commentsCount: sql<number>`
          (SELECT count(*) FROM ${Comments} WHERE ${Comments.projectId} = ${Projects.id})
        `.mapWith(Number),

        // LATEST COMMENTER: Get the Name and Image of the person who commented last.
        // We pack this into a JSON object so it fits into one column.
        latestCommenter: sql`
          (SELECT json_build_object('name', ${Users.name}, 'image', ${Users.image})
           FROM ${Comments}
           LEFT JOIN ${Users} ON ${Comments.userId} = ${Users.id}
           WHERE ${Comments.projectId} = ${Projects.id}
           ORDER BY ${Comments.createdAt} DESC
           LIMIT 1)
        `,
      })
      .from(Projects)
      // Sort by newest first, using ID as a tie-breaker for deterministic order
      .orderBy(desc(Projects.createdAt), desc(Projects.id))
      .$dynamic();

    // 3. SEARCH FILTERS
    // If the user typed something in the search bar, filter the title or description
    if (query?.trim()) {
      const like = `%${query.trim()}%`;
      q = q.where(
        or(ilike(Projects.title, like), ilike(Projects.description, like)),
      );
    }

    // If a category (e.g., 'tech') is selected, filter by it
    if (category) {
      q = q.where(eq(Projects.category, category));
    }

    // 4. CURSOR PAGINATION (The "Infinite Scroll" Logic)
    // If we have a cursor (e.g., "2026-03-22|uuid"), we only fetch projects
    // that were created BEFORE that specific timestamp and ID.
    if (cursor) {
      const [ts, id] = cursor.split("|");
      const cursorDate = new Date(ts);
      q = q.where(
        or(
          lt(Projects.createdAt, cursorDate),
          and(eq(Projects.createdAt, cursorDate), lt(Projects.id, id)),
        ),
      );
    }

    // 5. EXECUTION
    // We fetch one extra (limit + 1) to see if there's a "next page"
    const rows = await q.limit(limit + 1);
    const hasMore = rows.length > limit;

    // If we found an extra item, remove it from the data we return to the UI
    const data = hasMore ? rows.slice(0, limit) : rows;

    // 6. GENERATE NEXT CURSOR
    // Create the string for the NEXT time the user clicks "Load More"
    const nextCursor = hasMore
      ? `${data[data.length - 1].createdAt.toISOString()}|${data[data.length - 1].id}`
      : null;

    // Return everything as a success!
    return { data, nextCursor, success: true };
  },
);
