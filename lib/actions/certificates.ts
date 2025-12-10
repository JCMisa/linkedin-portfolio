"use server";

import { db } from "@/config/db";
import { withErrorHandling } from "../utils";
import { getCurrentUser } from "./users";
import { Certificates } from "@/config/schema";
import { revalidateTag, unstable_cache } from "next/cache";
import { desc, eq } from "drizzle-orm";

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

    revalidateTag("certificates", "");
    return { data: data.updatedTitle, success: true };
  }
);

export const deleteCertificate = withErrorHandling(
  async (certificateId: string) => {
    const user = await getCurrentUser();

    if (!user) {
      return { data: null, success: false };
    }

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
