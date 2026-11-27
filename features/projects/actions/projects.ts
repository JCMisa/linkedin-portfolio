"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { Projects } from "@/db/schema";
import { deleteImage, deleteReplacedImage } from "@/lib/cloudinary";
import { ActionError } from "@/lib/errors";
import { adminActionClient } from "@/lib/safe-action";
import {
  projectIdSchema,
  projectInputSchema,
  updateProjectSchema,
} from "../schemas";

const toRow = (input: {
  title: string;
  description: string;
  imageUrl: string;
  githubUrl: string | null;
  liveUrl: string | null;
  category: string;
  techStacks: string[];
}) => ({
  title: input.title,
  description: input.description,
  image: input.imageUrl,
  githubLink: input.githubUrl,
  liveLink: input.liveUrl,
  category: input.category,
  techStacks: input.techStacks,
});

export const addProject = adminActionClient
  .inputSchema(projectInputSchema)
  .action(async ({ parsedInput }) => {
    const [row] = await db
      .insert(Projects)
      .values(toRow(parsedInput))
      .returning({ id: Projects.id, title: Projects.title });

    revalidatePath("/", "layout");
    return row;
  });

export const updateProject = adminActionClient
  .inputSchema(updateProjectSchema)
  .action(async ({ parsedInput: { id, ...input } }) => {
    const [current] = await db
      .select({ image: Projects.image })
      .from(Projects)
      .where(eq(Projects.id, id))
      .limit(1);
    if (!current) throw new ActionError("Project not found.");

    const [row] = await db
      .update(Projects)
      .set({ ...toRow(input), updatedAt: new Date() })
      .where(eq(Projects.id, id))
      .returning({ id: Projects.id, title: Projects.title });

    await deleteReplacedImage(current.image, input.imageUrl);
    revalidatePath("/", "layout");
    return row;
  });

export const deleteProject = adminActionClient
  .inputSchema(projectIdSchema)
  .action(async ({ parsedInput: { projectId } }) => {
    const [deleted] = await db
      .delete(Projects)
      .where(eq(Projects.id, projectId))
      .returning({ id: Projects.id, image: Projects.image });
    if (!deleted) throw new ActionError("Project not found.");

    await deleteImage(deleted.image);
    revalidatePath("/", "layout");
    return { id: deleted.id };
  });
