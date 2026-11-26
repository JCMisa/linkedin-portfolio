"use server";

import { z } from "zod";
import { uploadImage } from "@/lib/cloudinary";
import { adminActionClient } from "@/lib/safe-action";
import { UPLOAD_FOLDERS } from "@/lib/upload-folders";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

const uploadImageSchema = z.object({
  file: z
    .instanceof(File, { message: "Choose an image to upload" })
    .refine((f) => f.size <= MAX_IMAGE_BYTES, "Image must be 10 MB or smaller")
    .refine((f) => IMAGE_TYPES.includes(f.type), "Use a JPG, PNG, WebP or SVG"),
  folder: z.enum(UPLOAD_FOLDERS).default("jcm"),
});

/** Admin-only image upload. Returns `{ data: { url } }` on success. */
export const uploadImageAction = adminActionClient
  .inputSchema(uploadImageSchema)
  .action(async ({ parsedInput: { file, folder } }) => ({
    url: await uploadImage(file, folder),
  }));
