"use server";

import { db } from "@/config/db";
import { withErrorHandling } from "../utils";
import { Projects } from "@/config/schema";
import { getCurrentUser } from "./users";
import { desc } from "drizzle-orm";

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
