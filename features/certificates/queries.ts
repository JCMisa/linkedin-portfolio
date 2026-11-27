import "server-only";
import { desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { Certificates } from "@/db/schema";

/** Cache tag shared by all certificate reads; mutations call updateTag(). */
export const CERTIFICATES_TAG = "certificates";

const cacheOptions = { revalidate: 3600, tags: [CERTIFICATES_TAG] };

// unstable_cache is deliberate: "use cache" needs cacheComponents, which
// requires Suspense boundaries around every session read (not worth it yet).
export const getAllCertificates = unstable_cache(
  async () =>
    db.select().from(Certificates).orderBy(desc(Certificates.acquiredDate)),
  ["certificates", "all"],
  cacheOptions,
);

export const getLatestCertificates = unstable_cache(
  async (limit: number) =>
    db
      .select()
      .from(Certificates)
      .orderBy(desc(Certificates.acquiredDate))
      .limit(limit),
  ["certificates", "latest"],
  cacheOptions,
);
