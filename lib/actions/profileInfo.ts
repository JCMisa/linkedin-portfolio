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

    return null;
  }),
  ["personal-info"], // Key parts (cache tag)
  {
    // revalidate: 3600, // Cache for 1 hour (adjust as needed)
    revalidate: false, // Cache forever until manual revalidation
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

export const updateContactInfo = withErrorHandling(
  async (updatedContactInfo: ContactInfoType) => {
    const [currentInfo] = await db.select().from(PersonalInfo);

    if (!currentInfo) {
      return {
        success: false,
        error: "Personal info not found",
        city: null,
        province: null,
        country: null,
        email: null,
        contactNumber: null,
        linkedinLink: null,
        portfolioLink: null,
        githubLink: null,
        facebookLink: null,
        instagramLink: null,
        xLink: null,
      };
    }

    const [updated] = await db
      .update(PersonalInfo)
      .set({
        city: updatedContactInfo.city,
        province: updatedContactInfo.province,
        country: updatedContactInfo.country,
        email: updatedContactInfo.email,
        contactNumber: updatedContactInfo.contactNumber,
        linkedinLink: updatedContactInfo.linkedinLink,
        portfolioLink: updatedContactInfo.portfolioLink,
        githubLink: updatedContactInfo.githubLink,
        facebookLink: updatedContactInfo.facebookLink,
        instagramLink: updatedContactInfo.instagramLink,
        xLink: updatedContactInfo.xLink,
      })
      .where(eq(PersonalInfo.id, currentInfo.id))
      .returning({
        city: PersonalInfo.city,
        province: PersonalInfo.province,
        country: PersonalInfo.country,
        email: PersonalInfo.email,
        contactNumber: PersonalInfo.contactNumber,
        linkedinLink: PersonalInfo.linkedinLink,
        portfolioLink: PersonalInfo.portfolioLink,
        githubLink: PersonalInfo.githubLink,
        facebookLink: PersonalInfo.facebookLink,
        instagramLink: PersonalInfo.instagramLink,
        xLink: PersonalInfo.xLink,
      });

    if (!updated) {
      return {
        success: false,
        error: "Failed to update contact info",
        city: null,
        province: null,
        country: null,
        email: null,
        contactNumber: null,
        linkedinLink: null,
        portfolioLink: null,
        githubLink: null,
        facebookLink: null,
        instagramLink: null,
        xLink: null,
      };
    }

    revalidateTag("personalInfo", "");

    return {
      success: true,
      city: updated.city,
      province: updated.province,
      country: updated.country,
      email: updated.email,
      contactNumber: updated.contactNumber,
      linkedinLink: updated.linkedinLink,
      portfolioLink: updated.portfolioLink,
      githubLink: updated.githubLink,
      facebookLink: updated.facebookLink,
      instagramLink: updated.instagramLink,
      xLink: updated.xLink,
    };
  }
);

export const updateAboutMessage = withErrorHandling(
  async (updatedAbout: string) => {
    // Get current personal info
    const [currentInfo] = await db.select().from(PersonalInfo);

    if (!currentInfo) {
      return {
        success: false,
        error: "Personal info not found",
        about: null,
      };
    }

    // Update database and verify the update
    const [updated] = await db
      .update(PersonalInfo)
      .set({
        about: updatedAbout,
      })
      .where(eq(PersonalInfo.id, currentInfo.id))
      .returning({ about: PersonalInfo.about });

    if (!updated) {
      return {
        success: false,
        error: "Failed to update about message",
        about: null,
      };
    }

    // Revalidate cache
    revalidateTag("personalInfo", "");

    return {
      success: true,
      about: updated.about,
    };
  }
);

export const updateServices = withErrorHandling(
  async (updatedServices: string[]) => {
    const [currentInfo] = await db.select().from(PersonalInfo);

    if (!currentInfo) {
      return {
        success: false,
        error: "Personal info not found",
        services: null,
      };
    }

    const [updated] = await db
      .update(PersonalInfo)
      .set({
        services: updatedServices,
      })
      .where(eq(PersonalInfo.id, currentInfo.id))
      .returning({ services: PersonalInfo.services });

    if (!updated) {
      return {
        success: false,
        error: "Failed to update services",
        services: null,
      };
    }

    revalidateTag("personalInfo", "");

    return {
      success: true,
      services: updated.services,
    };
  }
);

// skills table
type SkillsType = {
  id: string;
  title: string;
  description: string;
  items: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
};

export const updateSkills = withErrorHandling(
  async (updatedSkills: SkillsType[]) => {
    const [currentInfo] = await db.select().from(PersonalInfo);

    if (!currentInfo) {
      return {
        success: false,
        error: "Personal info not found",
        skills: null,
      };
    }

    const [updated] = await db
      .update(PersonalInfo)
      .set({
        skills: updatedSkills as any,
      })
      .where(eq(PersonalInfo.id, currentInfo.id))
      .returning({ skills: PersonalInfo.skills });

    if (!updated) {
      return {
        success: false,
        error: "Failed to update skills",
        skills: null,
      };
    }

    revalidateTag("personalInfo", "");

    return {
      success: true,
      skills: updated.skills as SkillsType[],
    };
  }
);

// top voices table
type TopVoicesType = {
  id: string;
  name: string;
  profileImg: string;
  company: string;
  comment: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export const updateTopVoices = withErrorHandling(
  async (topVoices: TopVoicesType[]) => {
    // Get current personal info
    const [currentInfo] = await db.select().from(PersonalInfo);

    if (!currentInfo) {
      return {
        success: false,
        error: "Personal info not found",
        topVoices: null,
      };
    }

    // Delete old testimonial images from Cloudinary that are no longer in the new array
    const oldTopVoices = (currentInfo.topVoices as TopVoicesType[]) || [];
    const newProfileImgs = new Set(
      topVoices.map((v) => v.profileImg).filter(Boolean)
    );

    for (const oldVoice of oldTopVoices) {
      if (
        oldVoice.profileImg &&
        !newProfileImgs.has(oldVoice.profileImg) &&
        oldVoice.profileImg.includes("cloudinary.com")
      ) {
        try {
          await deleteImageFromCloudinary(oldVoice.profileImg);
        } catch (error) {
          console.error("Error deleting old profile image:", error);
          // Continue even if deletion fails
        }
      }
    }

    // Update database
    const [updated] = await db
      .update(PersonalInfo)
      .set({
        topVoices: topVoices as any,
      })
      .where(eq(PersonalInfo.id, currentInfo.id))
      .returning({ topVoices: PersonalInfo.topVoices });

    if (!updated) {
      return {
        success: false,
        error: "Failed to update top voices",
        topVoices: null,
      };
    }

    // Revalidate cache
    revalidateTag("personalInfo", "");

    return {
      success: true,
      topVoices: updated.topVoices as TopVoicesType[],
    };
  }
);
