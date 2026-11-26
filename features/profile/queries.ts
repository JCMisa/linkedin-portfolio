import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { PersonalInfo } from "@/db/schema";

/** Cache tag for the single PersonalInfo row; profile actions call updateTag(). */
export const PERSONAL_INFO_TAG = "personalInfo";

// TODO(v3 phase 6): migrate unstable_cache to "use cache" + cacheTag()
export const getPersonalInfo = unstable_cache(
  async () => {
    const [row] = await db.select().from(PersonalInfo).limit(1);
    return row ?? null;
  },
  ["personal-info"],
  { revalidate: 3600, tags: [PERSONAL_INFO_TAG] },
);
