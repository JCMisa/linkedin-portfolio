"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db } from "@/db";
import { Certificates } from "@/db/schema";
import { deleteImage, deleteReplacedImage } from "@/lib/cloudinary";
import { ActionError } from "@/lib/errors";
import { adminActionClient } from "@/lib/safe-action";
import {
  certificateIdSchema,
  certificateInputSchema,
  updateCertificateSchema,
} from "./schemas";
import { CERTIFICATES_TAG } from "./queries";

export const addCertificate = adminActionClient
  .inputSchema(certificateInputSchema)
  .action(async ({ parsedInput: { imageUrl, ...input } }) => {
    const [row] = await db
      .insert(Certificates)
      .values({ ...input, image: imageUrl })
      .returning({ id: Certificates.id, title: Certificates.title });

    updateTag(CERTIFICATES_TAG);
    return row;
  });

export const updateCertificate = adminActionClient
  .inputSchema(updateCertificateSchema)
  .action(async ({ parsedInput: { id, imageUrl, ...input } }) => {
    const [current] = await db
      .select({ image: Certificates.image })
      .from(Certificates)
      .where(eq(Certificates.id, id))
      .limit(1);
    if (!current) throw new ActionError("Certificate not found.");

    const [row] = await db
      .update(Certificates)
      .set({ ...input, image: imageUrl, updatedAt: new Date() })
      .where(eq(Certificates.id, id))
      .returning({ id: Certificates.id, title: Certificates.title });

    await deleteReplacedImage(current.image, imageUrl);
    updateTag(CERTIFICATES_TAG);
    return row;
  });

export const deleteCertificate = adminActionClient
  .inputSchema(certificateIdSchema)
  .action(async ({ parsedInput: { certificateId } }) => {
    const [deleted] = await db
      .delete(Certificates)
      .where(eq(Certificates.id, certificateId))
      .returning({ id: Certificates.id, image: Certificates.image });
    if (!deleted) throw new ActionError("Certificate not found.");

    await deleteImage(deleted.image);
    updateTag(CERTIFICATES_TAG);
    return { id: deleted.id };
  });
