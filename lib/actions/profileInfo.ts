"use server";

import { db } from "@/config/db";
import { withErrorHandling } from "../utils";
import { PersonalInfo } from "@/config/schema";
import { unstable_cache, revalidateTag } from "next/cache";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../cloudinary";
import { eq } from "drizzle-orm";

export const getPersonalInfo = unstable_cache(
  withErrorHandling(async () => {
    const [data] = await db.select().from(PersonalInfo);

    if (data) {
      return data;
    }

    return [];
  }),
  ["personal-info"], // Key parts (cache tag)
  {
    revalidate: 3600, // Cache for 1 hour (adjust as needed)
    tags: ["personalInfo"], // Tag for manual revalidation later
  }
);

export const updateProfileImage = withErrorHandling(
  async (imageUrl: string | null) => {
    // Get current personal info
    const [currentInfo] = await db.select().from(PersonalInfo);

    if (!currentInfo) {
      return {
        success: false,
        error: "Personal info not found",
        imageUrl: null,
      };
    }

    // Delete old image from Cloudinary if it exists and is different
    if (currentInfo.profileImg && currentInfo.profileImg !== imageUrl) {
      try {
        await deleteImageFromCloudinary(currentInfo.profileImg);
      } catch (error) {
        console.error("Error deleting old image from Cloudinary:", error);
        // Continue with update even if deletion fails
      }
    }

    // Update database and verify the update
    const [updated] = await db
      .update(PersonalInfo)
      .set({
        profileImg: imageUrl,
      })
      .where(eq(PersonalInfo.id, currentInfo.id))
      .returning({ profileImg: PersonalInfo.profileImg });

    if (!updated) {
      return {
        success: false,
        error: "Failed to update profile image",
        imageUrl: null,
      };
    }

    // Revalidate cache
    revalidateTag("personalInfo", "");

    return { success: true, imageUrl: updated.profileImg };
  }
);

export const updateCoverImage = withErrorHandling(
  async (imageUrl: string | null) => {
    // Get current personal info
    const [currentInfo] = await db.select().from(PersonalInfo);

    if (!currentInfo) {
      return {
        success: false,
        error: "Personal info not found",
        imageUrl: null,
      };
    }

    // Delete old image from Cloudinary if it exists and is different
    if (currentInfo.coverImg && currentInfo.coverImg !== imageUrl) {
      try {
        await deleteImageFromCloudinary(currentInfo.coverImg);
      } catch (error) {
        console.error("Error deleting old image from Cloudinary:", error);
        // Continue with update even if deletion fails
      }
    }

    // Update database and verify the update
    const [updated] = await db
      .update(PersonalInfo)
      .set({
        coverImg: imageUrl,
      })
      .where(eq(PersonalInfo.id, currentInfo.id))
      .returning({ coverImg: PersonalInfo.coverImg });

    if (!updated) {
      return {
        success: false,
        error: "Failed to update cover image",
        imageUrl: null,
      };
    }

    // Revalidate cache
    revalidateTag("personalInfo", "");

    return { success: true, imageUrl: updated.coverImg };
  }
);

type ExperiencesType = {
  id: string;
  title: string;
  description: string;
  bannerImg: string;
  dateFrom: string;
  dateTo: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export const updateExperiences = withErrorHandling(
  async (experiences: ExperiencesType[]) => {
    // Get current personal info
    const [currentInfo] = await db.select().from(PersonalInfo);

    if (!currentInfo) {
      return {
        success: false,
        error: "Personal info not found",
        experiences: null,
      };
    }

    // Delete old banner images from Cloudinary that are no longer in the new array
    const oldExperiences = (currentInfo.experiences as ExperiencesType[]) || [];
    const newBannerImgs = new Set(
      experiences.map((exp) => exp.bannerImg).filter(Boolean)
    );

    for (const oldExp of oldExperiences) {
      if (
        oldExp.bannerImg &&
        !newBannerImgs.has(oldExp.bannerImg) &&
        oldExp.bannerImg.includes("cloudinary.com")
      ) {
        try {
          await deleteImageFromCloudinary(oldExp.bannerImg);
        } catch (error) {
          console.error("Error deleting old banner image:", error);
          // Continue even if deletion fails
        }
      }
    }

    // Update database
    const [updated] = await db
      .update(PersonalInfo)
      .set({
        experiences: experiences as any,
      })
      .where(eq(PersonalInfo.id, currentInfo.id))
      .returning({ experiences: PersonalInfo.experiences });

    if (!updated) {
      return {
        success: false,
        error: "Failed to update experiences",
        experiences: null,
      };
    }

    // Revalidate cache
    revalidateTag("personalInfo", "");

    return {
      success: true,
      experiences: updated.experiences as ExperiencesType[],
    };
  }
);

export const updateName = withErrorHandling(async (updatedName: string) => {
  // Get current personal info
  const [currentInfo] = await db.select().from(PersonalInfo);

  if (!currentInfo) {
    return {
      success: false,
      error: "Personal info not found",
      name: null,
    };
  }

  // Update database and verify the update
  const [updated] = await db
    .update(PersonalInfo)
    .set({
      name: updatedName,
    })
    .where(eq(PersonalInfo.id, currentInfo.id))
    .returning({ name: PersonalInfo.name });

  if (!updated) {
    return {
      success: false,
      error: "Failed to update name",
      name: null,
    };
  }

  // Revalidate cache
  revalidateTag("personalInfo", "");

  return { success: true, name: updated.name };
});

export const updateIndustryRole = withErrorHandling(
  async (updatedIndustryRole: string) => {
    const [currentInfo] = await db.select().from(PersonalInfo);

    if (!currentInfo) {
      return {
        success: false,
        error: "Personal info not found",
        industryRole: null,
      };
    }

    const [updated] = await db
      .update(PersonalInfo)
      .set({
        industryRole: updatedIndustryRole,
      })
      .where(eq(PersonalInfo.id, currentInfo.id))
      .returning({ industryRole: PersonalInfo.industryRole });

    if (!updated) {
      return {
        success: false,
        error: "Failed to update industry role",
        industryRole: null,
      };
    }

    revalidateTag("personalInfo", "");

    return { success: true, industryRole: updated.industryRole };
  }
);

export const updateResume = withErrorHandling(
  async (updatedITResumeLink: string, updatedVAResumeLink: string) => {
    const [currentInfo] = await db.select().from(PersonalInfo);

    if (!currentInfo) {
      return {
        success: false,
        error: "Personal info not found",
        itResumeLink: null,
        vaResumeLink: null,
      };
    }

    const [updated] = await db
      .update(PersonalInfo)
      .set({
        itResumeLink: updatedITResumeLink,
        vaResumeLink: updatedVAResumeLink,
      })
      .where(eq(PersonalInfo.id, currentInfo.id))
      .returning({
        itResumeLink: PersonalInfo.itResumeLink,
        vaResumeLink: PersonalInfo.vaResumeLink,
      });

    if (!updated) {
      return {
        success: false,
        error: "Failed to update resume",
        itResumeLink: null,
        vaResumeLink: null,
      };
    }

    revalidateTag("personalInfo", "");

    return {
      success: true,
      itResumeLink: updated.itResumeLink,
      vaResumeLink: updated.vaResumeLink,
    };
  }
);
