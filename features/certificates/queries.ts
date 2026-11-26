import "server-only";
import { desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { Certificates } from "@/db/schema";

/** Cache tag shared by all certificate reads; mutations call updateTag(). */
export const CERTIFICATES_TAG = "certificates";

const cacheOptions = { revalidate: 3600, tags: [CERTIFICATES_TAG] };

// TODO(v3 phase 6): migrate unstable_cache to "use cache" + cacheTag()
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
