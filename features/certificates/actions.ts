"use server";

import { db } from "@/db";
import { withErrorHandling } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth";
import { Certificates } from "@/db/schema";
import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

export const addCertificate = withErrorHandling(
  async (certificateData: CertificateInsertedDataType) => {
    await requireAdmin();

    const [data] = await db
      .insert(Certificates)
      .values({
        title: certificateData.title,
        description: certificateData.description,
        image: certificateData.imageUrl,
        acquiredDate: certificateData.acquiredDate,
      })
      .returning({ insertedCertificateTitle: Certificates.title });

    if (data && data.insertedCertificateTitle) {
      revalidateTag("certificates", "");
      return { data: data.insertedCertificateTitle, success: true };
    }
    return { data: null, success: false };
  },
);

export const updateCertificate = withErrorHandling(
  async (
    id: string,
    payload: {
      title: string;
      description: string;
      imageUrl: string;
      acquiredDate: Date;
    },
  ) => {
    await requireAdmin();

    // Get the current certificate to check if image is being changed
    const [currentCertificate] = await db
      .select()
      .from(Certificates)
      .where(eq(Certificates.id, id))
      .limit(1);

    if (!currentCertificate) {
      return { data: null, success: false, error: "Certificate not found" };
    }

    // If image URL is being updated and it's different from the current one,
    // delete the old image from Cloudinary
    if (
      payload.imageUrl &&
      payload.imageUrl !== currentCertificate.image &&
      currentCertificate.image
    ) {
      try {
        await deleteImageFromCloudinary(currentCertificate.image);
        // Note: We don't fail the update if Cloudinary deletion fails
        // The certificate will still be updated with the new image
      } catch (error) {
        console.error("Error deleting old image from Cloudinary:", error);
        // Continue with certificate update even if old image deletion fails
      }
    }

    const [data] = await db
      .update(Certificates)
      .set({
        title: payload.title,
        description: payload.description,
        image: payload.imageUrl,
        acquiredDate: payload.acquiredDate,
        updatedAt: new Date(),
      })
      .where(eq(Certificates.id, id))
      .returning({ updatedTitle: Certificates.title });

    if (data && data.updatedTitle) {
      revalidateTag("certificates", "");
      return { data: data.updatedTitle, success: true };
    }
    return {
      data: null,
      success: false,
      error: "Failed to update certificate",
    };
  },
);

export const deleteCertificate = withErrorHandling(
  async (certificateId: string) => {
    await requireAdmin();

    // First, get the certificate to retrieve the image URL
    const [certificate] = await db
      .select()
      .from(Certificates)
      .where(eq(Certificates.id, certificateId))
      .limit(1);

    if (!certificate) {
      return { data: null, success: false, error: "Certificate not found" };
    }

    // Delete the image from Cloudinary if it exists
    if (certificate.image) {
      try {
        await deleteImageFromCloudinary(certificate.image);
        // Note: We don't fail the deletion if Cloudinary deletion fails
        // The certificate will still be deleted from the database
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        // Continue with certificate deletion even if image deletion fails
      }
    }

    // Delete the certificate from the database
    const data = await db
      .delete(Certificates)
      .where(eq(Certificates.id, certificateId));

    if (data) {
      revalidateTag("certificates", "");
      return { data: null, success: true };
    }
    return { data: null, success: false };
  },
);
