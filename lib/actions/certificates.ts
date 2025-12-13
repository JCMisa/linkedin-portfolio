"use server";

import { db } from "@/config/db";
import { withErrorHandling } from "../utils";
import { getCurrentUser } from "./users";
import { Certificates } from "@/config/schema";
import { revalidateTag, unstable_cache } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { deleteImageFromCloudinary } from "./cloudinary";

export const getAllCertificates = unstable_cache(
  withErrorHandling(async () => {
    const user = await getCurrentUser();

    if (!user) {
      return { data: null, success: false };
    }

    const data = await db
      .select()
      .from(Certificates)
      .orderBy(desc(Certificates.acquiredDate));

    if (data && data.length > 0) {
      return { data: data ?? [], success: true };
    }
    return { data: null, success: false };
  }),
  ["all-certificates-list-full"], // Key parts (cache tag)
  {
    revalidate: 3600, // Cache for 1 hour (adjust as needed)
    tags: ["certificates"], // Tag for manual revalidation later
  }
);

export const getLatestThreeCertificates = unstable_cache(
  withErrorHandling(async () => {
    const user = await getCurrentUser();

    if (!user) {
      return { data: null, success: false };
    }

    const data = await db
      .select()
      .from(Certificates)
      .orderBy(desc(Certificates.acquiredDate))
      .limit(3);

    if (data && data.length > 0) {
      return { data: data ?? [], success: true };
    }
    return { data: null, success: false };
  }),
  ["all-certificates-list-three"], // Key parts (cache tag)
  {
    revalidate: 3600, // Cache for 1 hour (adjust as needed)
    tags: ["certificates"], // Tag for manual revalidation later
  }
);

export const addCertificate = withErrorHandling(
  async (certificateData: CertificateInsertedDataType) => {
    const user = await getCurrentUser();

    if (!user) {
      return { data: null, success: false };
    }

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
  }
);

export const updateCertificate = withErrorHandling(
  async (
    id: string,
    payload: {
      title: string;
      description: string;
      imageUrl: string;
      acquiredDate: Date;
    }
  ) => {
    const user = await getCurrentUser();

    if (!user) {
      return { data: null, success: false, error: "Unauthorized" };
    }

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
  }
);

export const deleteCertificate = withErrorHandling(
  async (certificateId: string) => {
    const user = await getCurrentUser();

    if (!user) {
      return { data: null, success: false };
    }

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
  }
);
