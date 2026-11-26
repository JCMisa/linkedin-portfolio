"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db } from "@/db";
import { PersonalInfo } from "@/db/schema";
import { deleteImage } from "@/lib/cloudinary";
import { ActionError } from "@/lib/errors";
import { adminActionClient } from "@/lib/safe-action";
import { PERSONAL_INFO_TAG } from "./queries";
import {
  aboutSchema,
  contactInfoSchema,
  experiencesSchema,
  imageUrlSchema,
  industryRoleSchema,
  nameSchema,
  resumeSchema,
  servicesSchema,
  skillsSchema,
  testimonialsSchema,
} from "./schemas";

type PersonalInfoRow = typeof PersonalInfo.$inferSelect;
type PersonalInfoPatch = Partial<Omit<typeof PersonalInfo.$inferInsert, "id">>;

/** Loads the single PersonalInfo row (the portfolio owner's profile). */
async function loadProfile(): Promise<PersonalInfoRow> {
  const [row] = await db.select().from(PersonalInfo).limit(1);
  if (!row)
    throw new ActionError(
      "Profile not found. Seed the personalInfo table first.",
    );
  return row;
}

/** Applies a patch to the profile row, refreshes the cache, returns the row. */
async function saveProfile(id: string, patch: PersonalInfoPatch) {
  const [row] = await db
    .update(PersonalInfo)
    .set(patch)
    .where(eq(PersonalInfo.id, id))
    .returning();
  updateTag(PERSONAL_INFO_TAG);
  return row;
}

/** Deletes Cloudinary images that were in `before` but are gone from `after`. */
async function deleteRemovedImages(before: string[], after: string[]) {
  const kept = new Set(after.filter(Boolean));
  await Promise.all(
    before.filter((url) => url && !kept.has(url)).map(deleteImage),
  );
}

export const updateProfileImage = adminActionClient
  .inputSchema(imageUrlSchema)
  .action(async ({ parsedInput: { imageUrl } }) => {
    const current = await loadProfile();
    const row = await saveProfile(current.id, { profileImg: imageUrl });
    await deleteRemovedImages([current.profileImg ?? ""], [imageUrl ?? ""]);
    return { profileImg: row.profileImg };
  });

export const updateCoverImage = adminActionClient
  .inputSchema(imageUrlSchema)
  .action(async ({ parsedInput: { imageUrl } }) => {
    const current = await loadProfile();
    const row = await saveProfile(current.id, { coverImg: imageUrl });
    await deleteRemovedImages([current.coverImg ?? ""], [imageUrl ?? ""]);
    return { coverImg: row.coverImg };
  });

export const updateName = adminActionClient
  .inputSchema(nameSchema)
  .action(async ({ parsedInput }) => {
    const row = await saveProfile((await loadProfile()).id, parsedInput);
    return { name: row.name };
  });

export const updateIndustryRole = adminActionClient
  .inputSchema(industryRoleSchema)
  .action(async ({ parsedInput }) => {
    const row = await saveProfile((await loadProfile()).id, parsedInput);
    return { industryRole: row.industryRole };
  });

export const updateResume = adminActionClient
  .inputSchema(resumeSchema)
  .action(async ({ parsedInput }) => {
    const row = await saveProfile((await loadProfile()).id, parsedInput);
    return { itResumeLink: row.itResumeLink, vaResumeLink: row.vaResumeLink };
  });

export const updateContactInfo = adminActionClient
  .inputSchema(contactInfoSchema)
  .action(async ({ parsedInput }) => {
    const row = await saveProfile((await loadProfile()).id, parsedInput);
    const { city, province, country, email, contactNumber } = row;
    const {
      linkedinLink,
      portfolioLink,
      githubLink,
      facebookLink,
      instagramLink,
      xLink,
    } = row;
    return {
      city,
      province,
      country,
      email,
      contactNumber,
      linkedinLink,
      portfolioLink,
      githubLink,
      facebookLink,
      instagramLink,
      xLink,
    };
  });

export const updateAboutMessage = adminActionClient
  .inputSchema(aboutSchema)
  .action(async ({ parsedInput }) => {
    const row = await saveProfile((await loadProfile()).id, parsedInput);
    return { about: row.about };
  });

export const updateServices = adminActionClient
  .inputSchema(servicesSchema)
  .action(async ({ parsedInput }) => {
    const row = await saveProfile((await loadProfile()).id, parsedInput);
    return { services: row.services };
  });

export const updateSkills = adminActionClient
  .inputSchema(skillsSchema)
  .action(async ({ parsedInput }) => {
    const row = await saveProfile((await loadProfile()).id, parsedInput);
    return { skills: row.skills };
  });

export const updateExperiences = adminActionClient
  .inputSchema(experiencesSchema)
  .action(async ({ parsedInput: { experiences } }) => {
    const current = await loadProfile();
    const row = await saveProfile(current.id, { experiences });
    await deleteRemovedImages(
      current.experiences.map((e) => e.bannerImg),
      experiences.map((e) => e.bannerImg),
    );
    return { experiences: row.experiences };
  });

export const updateTopVoices = adminActionClient
  .inputSchema(testimonialsSchema)
  .action(async ({ parsedInput: { topVoices } }) => {
    const current = await loadProfile();
    const row = await saveProfile(current.id, { topVoices });
    await deleteRemovedImages(
      current.topVoices.map((v) => v.profileImg),
      topVoices.map((v) => v.profileImg),
    );
    return { topVoices: row.topVoices };
  });
