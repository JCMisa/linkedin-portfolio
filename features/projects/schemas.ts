import { z } from "zod";

/** Shared by server actions (validation) and forms (Phase 5, react-hook-form). */

export const PROJECT_CATEGORIES = ["software", "virtual", "others"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/** An optional URL field: "" (empty input) is allowed and stored as null. */
const optionalUrl = z
  .union([z.url({ message: "Enter a valid URL (https://…)" }), z.literal("")])
  .optional()
  .transform((v) => v || null);

export const projectInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150),
  description: z.string().trim().min(1, "Description is required").max(5000),
  imageUrl: z.url({ message: "Upload a project image" }),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  category: z.enum(PROJECT_CATEGORIES, { message: "Select a category" }),
  techStacks: z
    .array(z.string().trim().min(1))
    .min(1, "Add at least one technology"),
});
export type ProjectInput = z.input<typeof projectInputSchema>;

export const updateProjectSchema = projectInputSchema.extend({
  id: z.uuid(),
});

export const projectIdSchema = z.object({ projectId: z.uuid() });

export const createCommentSchema = z.object({
  projectId: z.uuid(),
  content: z
    .string()
    .trim()
    .min(1, "Comment can't be empty")
    .max(2000, "Comment is too long"),
});

export const commentIdSchema = z.object({ commentId: z.uuid() });

/** Query-string params for GET /api/projects (feed + search). */
export const projectsQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.enum(PROJECT_CATEGORIES).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(5),
});
export type ProjectsQuery = z.infer<typeof projectsQuerySchema>;
