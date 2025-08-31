"use server";

import { db } from "@/config/db";
import { withErrorHandling } from "../utils";
import { Projects } from "@/config/schema";
import { getCurrentUser } from "./users";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
