import "server-only";
import { desc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { Certificates } from "@/db/schema";

/** Cache tag shared by all certificate reads; mutations call updateTag(). */
export const CERTIFICATES_TAG = "certificates";

export async function getAllCertificates() {
  "use cache";
  cacheTag(CERTIFICATES_TAG);
  cacheLife("hours");
  return db
    .select()
    .from(Certificates)
    .orderBy(desc(Certificates.acquiredDate));
}

export async function getLatestCertificates(limit: number) {
  "use cache";
  cacheTag(CERTIFICATES_TAG);
  cacheLife("hours");
  return db
    .select()
    .from(Certificates)
    .orderBy(desc(Certificates.acquiredDate))
    .limit(limit);
}
