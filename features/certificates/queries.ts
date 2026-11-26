import "server-only";
import { db } from "@/db";
import { withErrorHandling } from "@/lib/utils";
import { Certificates } from "@/db/schema";
import { unstable_cache } from "next/cache";
import { desc } from "drizzle-orm";

export const getAllCertificates = unstable_cache(
  withErrorHandling(async () => {
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
  },
);

export const getLatestThreeCertificates = unstable_cache(
  withErrorHandling(async () => {
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
  },
);
