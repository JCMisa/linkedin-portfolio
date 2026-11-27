"use server";

import { z } from "zod";
import { signUpload } from "@/lib/cloudinary";
import { adminActionClient } from "@/lib/safe-action";
import { UPLOAD_FOLDERS } from "@/lib/upload-folders";

/**
 * Admin-only: returns a short-lived Cloudinary signature so the browser can
 * upload the file directly to Cloudinary. The file never passes through our
 * server, which keeps the server-action body limit at Next's 1 MB default.
 */
export const getUploadSignature = adminActionClient
  .inputSchema(z.object({ folder: z.enum(UPLOAD_FOLDERS) }))
  .action(async ({ parsedInput: { folder } }) => signUpload(folder));
