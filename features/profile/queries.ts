import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { PersonalInfo } from "@/db/schema";

/** Cache tag for the single PersonalInfo row; profile actions call updateTag(). */
export const PERSONAL_INFO_TAG = "personalInfo";

// unstable_cache is deliberate: "use cache" needs cacheComponents, which
// requires Suspense boundaries around every session read (not worth it yet).
export const getPersonalInfo = unstable_cache(
  async () => {
    const [row] = await db.select().from(PersonalInfo).limit(1);
    return row ?? null;
  },
  ["personal-info"],
  { revalidate: 3600, tags: [PERSONAL_INFO_TAG] },
);
