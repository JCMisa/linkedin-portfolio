import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { PersonalInfo } from "@/db/schema";

/** Cache tag for the single PersonalInfo row; profile actions call updateTag(). */
export const PERSONAL_INFO_TAG = "personalInfo";

export async function getPersonalInfo() {
  "use cache";
  cacheTag(PERSONAL_INFO_TAG);
  cacheLife("hours");
  const [row] = await db.select().from(PersonalInfo).limit(1);
  return row ?? null;
}
