"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon, PenBoxIcon, ShieldCheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImageEditorDialog } from "./dialogs/ImageEditorDialog";
import { ExperiencesEditorDialog } from "./dialogs/ExperiencesEditorDialog";
import {
  getPersonalInfo,
  updateProfileImage,
  updateCoverImage,
  updateExperiences,
  updateName,
  updateIndustryRole,
  updateResume,
  updateContactInfo,
} from "@/lib/actions/profileInfo";
import { PersonalInfoType } from "@/config/schema";
import NameEditorDialog from "./dialogs/NameEditorDialog";
import IndustryRoleEditorDialog from "./dialogs/IndustryRoleEditorDialog";
import ResumeEditorDialog from "./dialogs/ResumeEditorDialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { showConfetti } from "@/lib/utils";
import ContactInfoEditorDialog from "./dialogs/ContactInfoEditorDialog";

interface ProfileBasicInfoProps {
  userRole?: string;
}

const ProfileBasicInfo = ({ userRole = "user" }: ProfileBasicInfoProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCoverDialogOpen, setIsCoverDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isExperiencesDialogOpen, setIsExperiencesDialogOpen] = useState(false);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [isIndustryRoleDialogOpen, setIsIndustryRoleDialogOpen] =
    useState(false);
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
  const [isContactInfoDialogOpen, setIsContactInfoDialogOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType | null>(
    null,
  );

  const isOwner = userRole === "admin" || userRole === "owner";

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const data = await getPersonalInfo();
        if (data && typeof data === "object" && "id" in data) {
          setPersonalInfo(data as PersonalInfoType);
        }
      } catch (error) {
        console.error("Error fetching personal info:", error);
      }
    };

    fetchPersonalInfo();
  }, []);

  const handleCoverImageSave = async (imageUrl: string | null) => {
    try {
      const result = await updateCoverImage(imageUrl);

      // Check if result is an error string (from withErrorHandling)
      if (typeof result === "string") {
        console.error("Error updating cover image:", result);
        throw new Error(result);
      }

      if (
        result &&
        typeof result === "object" &&
        "success" in result &&
        result.success
      ) {
        // Update local state with the actual saved URL from database
        const savedUrl = result.imageUrl || imageUrl;
        setPersonalInfo((prev) =>
          prev ? { ...prev, coverImg: savedUrl } : null,
        );
        // Refetch to ensure consistency
        const data = await getPersonalInfo();
        if (data && typeof data === "object" && "id" in data) {
          setPersonalInfo(data as PersonalInfoType);
        }
        toast.success("Cover image updated successfully");
        showConfetti();
      } else {
        const errorMsg = result?.error || "Failed to update cover image";
        console.error("Error updating cover image:", errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error in handleCoverImageSave:", error);
      throw error;
    }
  };

  const handleProfileImageSave = async (imageUrl: string | null) => {
    try {
      const result = await updateProfileImage(imageUrl);

      // Check if result is an error string (from withErrorHandling)
      if (typeof result === "string") {
        console.error("Error updating profile image:", result);
        throw new Error(result);
      }

      if (
        result &&
        typeof result === "object" &&
        "success" in result &&
        result.success
      ) {
        // Update local state with the actual saved URL from database
        const savedUrl = result.imageUrl || imageUrl;
        setPersonalInfo((prev) =>
          prev ? { ...prev, profileImg: savedUrl } : null,
        );
        // Refetch to ensure consistency
        const data = await getPersonalInfo();
        if (data && typeof data === "object" && "id" in data) {
          setPersonalInfo(data as PersonalInfoType);
        }
        toast.success("Profile image updated successfully");
        showConfetti();
      } else {
        const errorMsg = result?.error || "Failed to update profile image";
        console.error("Error updating profile image:", errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error in handleProfileImageSave:", error);
      throw error;
    }
  };

  const handleExperiencesSave = async (experiences: any[]) => {
    try {
      const result = await updateExperiences(experiences);

      // Check if result is an error string (from withErrorHandling)
      if (typeof result === "string") {
        console.error("Error updating experiences:", result);
        throw new Error(result);
      }

      if (
        result &&
        typeof result === "object" &&
        "success" in result &&
        result.success
      ) {
        // Update local state
        setPersonalInfo((prev) =>
          prev
            ? { ...prev, experiences: result.experiences || experiences }
            : null,
        );
        // Refetch to ensure consistency
        const data = await getPersonalInfo();
        if (data && typeof data === "object" && "id" in data) {
          setPersonalInfo(data as PersonalInfoType);
        }
        toast.success("Experiences updated successfully");
        showConfetti();
      } else {
        const errorMsg = result?.error || "Failed to update experiences";
        console.error("Error updating experiences:", errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error in handleExperiencesSave:", error);
      throw error;
    }
  };

  const handleNameSave = async (updatedName: string) => {
    try {
      const result = await updateName(updatedName);

      // Check if result is an error string (from withErrorHandling)
      if (typeof result === "string") {
        console.error("Error updating name:", result);
        throw new Error(result);
      }

      if (
        result &&
        typeof result === "object" &&
        "success" in result &&
        result.success
      ) {
        // Update local state
        setPersonalInfo((prev) =>
          prev ? { ...prev, name: result.name || updatedName } : null,
        );
        // Refetch to ensure consistency
        const data = await getPersonalInfo();
        if (data && typeof data === "object" && "id" in data) {
          setPersonalInfo(data as PersonalInfoType);
        }
        toast.success("Name updated successfully");
        showConfetti();
      } else {
        const errorMsg = result?.error || "Failed to update name";
        console.error("Error updating name:", errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error in handleNameSave:", error);
      throw error;
    }
  };

  const handleIndustryRoleSave = async (updatedIndustryRole: string) => {
    try {
      const result = await updateIndustryRole(updatedIndustryRole);

      // Check if result is an error string (from withErrorHandling)
      if (typeof result === "string") {
        console.error("Error updating industry role:", result);
        throw new Error(result);
      }

      if (
        result &&
        typeof result === "object" &&
        "success" in result &&
        result.success
      ) {
        // Update local state
        setPersonalInfo((prev) =>
          prev
            ? {
                ...prev,
                industryRole: result.industryRole || updatedIndustryRole,
              }
            : null,
        );
        // Refetch to ensure consistency
        const data = await getPersonalInfo();
        if (data && typeof data === "object" && "id" in data) {
          setPersonalInfo(data as PersonalInfoType);
        }
        toast.success("Industry role updated successfully");
        showConfetti();
      } else {
        const errorMsg = result?.error || "Failed to update industry role";
        console.error("Error updating industry role:", errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error in handleIndustryRoleSave:", error);
      throw error;
    }
  };

  const handleResumeSave = async (
    updatedITResumeLink: string,
    updatedVAResumeLink: string,
  ) => {
    try {
      const result = await updateResume(
        updatedITResumeLink,
        updatedVAResumeLink,
      );

      // Check if result is an error string (from withErrorHandling)
      if (typeof result === "string") {
        console.error("Error updating resume:", result);
        throw new Error(result);
      }

      if (
        result &&
        typeof result === "object" &&
        "success" in result &&
        result.success
      ) {
        // Update local state
        setPersonalInfo((prev) =>
          prev
            ? {
                ...prev,
                itResumeLink: result.itResumeLink || updatedITResumeLink,
                vaResumeLink: result.vaResumeLink || updatedVAResumeLink,
              }
            : null,
        );
        // Refetch to ensure consistency
        const data = await getPersonalInfo();
        if (data && typeof data === "object" && "id" in data) {
          setPersonalInfo(data as PersonalInfoType);
        }
        toast.success("Resumes saved successfully");
        showConfetti();
      } else {
        const errorMsg = result?.error || "Failed to update resume";
        console.error("Error updating resume:", errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error in handleResumeSave:", error);
      throw error;
    }
  };

  const handleContactInfoSave = async (updatedContactInfo: ContactInfoType) => {
    try {
      const result = await updateContactInfo(updatedContactInfo);

      // Check if result is an error string (from withErrorHandling)
      if (typeof result === "string") {
        console.error("Error updating contact info:", result);
        throw new Error(result);
      }

      if (
        result &&
        typeof result === "object" &&
        "success" in result &&
        result.success
      ) {
        // Update local state
        setPersonalInfo((prev) =>
          prev
            ? {
                ...prev,
                city: result.city || updatedContactInfo.city,
                province: result.province || updatedContactInfo.province,
                country: result.country || updatedContactInfo.country,
                email: result.email || updatedContactInfo.email,
                contactNumber:
                  result.contactNumber || updatedContactInfo.contactNumber,
                linkedinLink:
                  result.linkedinLink || updatedContactInfo.linkedinLink,
                portfolioLink:
                  result.portfolioLink || updatedContactInfo.portfolioLink,
                githubLink: result.githubLink || updatedContactInfo.githubLink,
                facebookLink:
                  result.facebookLink || updatedContactInfo.facebookLink,
                instagramLink:
                  result.instagramLink || updatedContactInfo.instagramLink,
                xLink: result.xLink || updatedContactInfo.xLink,
              }
            : null,
        );
        // Refetch to ensure consistency
        const data = await getPersonalInfo();
        if (data && typeof data === "object" && "id" in data) {
          setPersonalInfo(data as PersonalInfoType);
        }
        toast.success("Contact info updated successfully");
        showConfetti();
      } else {
        const errorMsg = result?.error || "Failed to update contact info";
        console.error("Error updating contact info:", errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Error in handleContactInfoSave:", error);
      throw error;
    }
  };

  const displayCoverImage = personalInfo?.coverImg || "/empty-img.webp";
  const displayProfileImage = personalInfo?.profileImg || "/empty-img.webp";

  // Find latest experience
  let latestExperience: any = null;
  if (
    personalInfo?.experiences &&
    Array.isArray(personalInfo.experiences) &&
    personalInfo.experiences.length > 0
  ) {
    const sorted = [...personalInfo.experiences].sort((a: any, b: any) => {
      const aIsCurrent = !a.dateTo || new Date(a.dateTo) >= new Date();
      const bIsCurrent = !b.dateTo || new Date(b.dateTo) >= new Date();
      if (aIsCurrent && !bIsCurrent) return -1;
      if (!aIsCurrent && bIsCurrent) return 1;
      const dateA = new Date(a.dateFrom || 0).getTime();
      const dateB = new Date(b.dateFrom || 0).getTime();
      return dateB - dateA;
    });
    latestExperience = sorted[0];
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center rounded-lg bg-neutral-100 lg:h-[400px] dark:bg-dark">
      {/* cover photo */}
      <div className="relative h-[35%] w-full">
        <Image
          src={displayCoverImage}
          alt="cover-img"
          width={1000}
          height={1000}
          className="h-full w-full rounded-t-lg object-cover"
        />

        {isOwner && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={() => setIsCoverDialogOpen(true)}
                className="absolute top-3 right-3 z-20 flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-all duration-200 ease-in-out hover:scale-105 dark:bg-neutral-100 dark:text-black"
              >
                <PenBoxIcon className="size-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Cover Photo</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* profile photo */}
      <div
        onClick={() => setIsProfileOpen(true)}
        className="relative z-10 mt-[-70px] ml-[20px] flex cursor-pointer items-start justify-start self-start sm:mt-[-100px]"
      >
        <Image
          src={displayProfileImage}
          alt="avatar"
          width={1000}
          height={1000}
          className="h-[100px] w-[100px] rounded-full border-3 border-white object-fill sm:h-[152px] sm:w-[152px] dark:border-dark"
        />
        {isOwner && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileDialogOpen(true);
                }}
                className="absolute right-0 bottom-0 z-20 flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-all duration-200 ease-in-out hover:scale-105 dark:bg-neutral-100 dark:text-black"
              >
                <PenBoxIcon className="size-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Profile Photo</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* profile info */}
      <div className="no-scrollbar h-full w-full overflow-auto p-[10px]">
        <div className="flex flex-col items-start justify-between gap-2 px-5 lg:flex-row">
          <div className="flex flex-col gap-[5px]">
            {isOwner ? (
              <Tooltip>
                <TooltipTrigger asChild disabled={!isOwner}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsNameDialogOpen(true);
                    }}
                    className="cursor-pointer text-2xl font-bold transition-all duration-200 ease-linear hover:opacity-[0.8]"
                  >
                    {personalInfo?.name}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Name</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <p className="text-2xl font-bold">{personalInfo?.name}</p>
            )}

            <div className="flex w-fit items-center gap-1 rounded-full border border-dashed border-blue-400 px-3 text-blue-400">
              <ShieldCheckIcon className="size-4 text-blue-400" />
              <p className="text-sm font-bold">Profile Owner</p>
            </div>

            {isOwner ? (
              <Tooltip>
                <TooltipTrigger asChild disabled={!isOwner}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsIndustryRoleDialogOpen(true);
                    }}
                    className="cursor-pointer text-sm transition-all duration-200 ease-linear hover:opacity-[0.8]"
                  >
                    {personalInfo?.industryRole || "Fullstack Developer 🚀"}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Industry Role</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <p className="text-sm">
                {personalInfo?.industryRole || "Fullstack Developer 🚀"}
              </p>
            )}

            <div className="my-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <span className="text-sm text-muted-foreground">
                {personalInfo?.city}, {personalInfo?.province},{" "}
                {personalInfo?.country}
              </span>
              <span className="hidden text-sm text-muted-foreground sm:block">
                •
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={"/contact"}
                  className="cursor-pointer text-sm text-blue-300 underline"
                >
                  Contact Info
                </Link>
                {isOwner && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsContactInfoDialogOpen(true);
                        }}
                        className="flex h-5 w-5 flex-none cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-all duration-200 ease-in-out hover:scale-105 dark:bg-neutral-100 dark:text-black"
                      >
                        <PenBoxIcon className="size-3" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Address & Contact Info</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* number of connections */}
            <p className="text-sm font-bold text-blue-400">500+ connections</p>
          </div>

          {/* experience and education */}
          <div className="flex flex-col gap-2">
            {/* latest experience */}
            {latestExperience ? (
              <div
                key={latestExperience.id || "latest"}
                className="flex items-center gap-1"
              >
                {latestExperience.bannerImg ? (
                  <Image
                    src={latestExperience.bannerImg}
                    alt={latestExperience.title || "experience"}
                    width={20}
                    height={20}
                    className="h-[20px] w-[20px] rounded-md object-fill"
                  />
                ) : (
                  <div className="h-[20px] w-[20px] rounded-md bg-neutral-300 dark:bg-neutral-700" />
                )}
                {isOwner ? (
                  <div
                    onClick={() => setIsExperiencesDialogOpen(true)}
                    className="cursor-pointer text-sm font-bold transition-all duration-200 ease-in-out hover:opacity-[0.8]"
                  >
                    {latestExperience.title || "Untitled Experience"}
                  </div>
                ) : (
                  <p className="text-sm font-bold">
                    {latestExperience.title || "Untitled Experience"}
                  </p>
                )}
              </div>
            ) : (
              // fallback latest experience
              <div className="flex items-center gap-1">
                <Image
                  src={"/empty-img.webp"}
                  alt="school-img"
                  width={1000}
                  height={1000}
                  className="h-[20px] w-[20px] rounded-md object-fill"
                />
                <p className="text-sm font-bold uppercase">
                  PHILADELPHIA TRUCK PARTS{" "}
                  <span className="text-sm text-muted-foreground italic">
                    (current)
                  </span>
                </p>
              </div>
            )}

            {/* latest education */}
            <div className="flex items-center gap-1">
              <Image
                src={"/lspu-logo.png"}
                alt="school-img"
                width={1000}
                height={1000}
                className="h-[20px] w-[20px] rounded-md object-fill"
              />
              <p className="text-sm font-bold">
                Laguna State Polytechnic University - San Pablo City
              </p>
            </div>
          </div>
        </div>

        {/* download resume */}
        <Popover>
          <PopoverTrigger asChild className="hidden md:flex">
            <Button
              className="absolute right-2 bottom-2 hidden cursor-pointer items-center justify-center gap-1 text-xs md:flex"
              variant={"secondary"}
              size={"sm"}
            >
              <DownloadIcon className="size-4" />
              Download Resume
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-2" align="end">
            <a
              href={
                personalInfo?.itResumeLink ||
                "https://drive.google.com/file/d/1xYahrMC5zf9qmsRX7_zzENlS31eMue29/view?usp=drive_link"
              }
              download={"John_Carlo_Misa_Resume_IT.pdf"}
              target="_blank"
              className="cursor-pointer text-sm transition-all duration-200 ease-in-out hover:text-blue-400"
            >
              IT Resume
            </a>
            <a
              href={
                personalInfo?.vaResumeLink ||
                "https://drive.google.com/file/d/1kMA1kKR1O6FpwRNBtsK29ChQafxFEkHi/view?usp=drive_link"
              }
              download={"John_Carlo_Misa_Resume_VA.pdf"}
              target="_blank"
              className="cursor-pointer text-sm transition-all duration-200 ease-in-out hover:text-blue-400"
            >
              VA Resume
            </a>
            {isOwner && (
              <>
                <Separator />
                <div
                  onClick={() => setIsResumeDialogOpen(true)}
                  className="cursor-pointer text-sm transition-all duration-200 ease-in-out hover:text-blue-400"
                >
                  Edit Resume
                </div>
              </>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* profile image full screen view */}
      {isProfileOpen && (
        <div
          className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black"
          onClick={() => setIsProfileOpen(false)}
        >
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(false)}
              className="absolute top-4 right-4 z-50 text-2xl text-white"
            >
              &times;
            </button>
            <Image
              src={displayProfileImage}
              alt="avatar"
              width={1000}
              height={1000}
              className="max-h-screen-lg max-w-screen-lg p-8"
            />
          </div>
        </div>
      )}

      {/* Image Editor Dialogs */}
      {isOwner && (
        <>
          <ImageEditorDialog
            open={isCoverDialogOpen}
            onOpenChange={setIsCoverDialogOpen}
            currentImageUrl={personalInfo?.coverImg || null}
            onSave={handleCoverImageSave}
            title="Edit Cover Photo"
            description="Upload a new cover photo or delete the current one"
            folder="jcm/cover"
          />
          <ImageEditorDialog
            open={isProfileDialogOpen}
            onOpenChange={setIsProfileDialogOpen}
            currentImageUrl={personalInfo?.profileImg || null}
            onSave={handleProfileImageSave}
            title="Edit Profile Photo"
            description="Upload a new profile photo or delete the current one"
            folder="jcm/profile"
          />
          <ExperiencesEditorDialog
            open={isExperiencesDialogOpen}
            onOpenChange={setIsExperiencesDialogOpen}
            currentExperiences={(personalInfo?.experiences as any[]) || []}
            onSave={handleExperiencesSave}
          />
          <NameEditorDialog
            open={isNameDialogOpen}
            onOpenChange={setIsNameDialogOpen}
            currentName={personalInfo?.name || ""}
            onSave={handleNameSave}
          />
          <IndustryRoleEditorDialog
            open={isIndustryRoleDialogOpen}
            onOpenChange={setIsIndustryRoleDialogOpen}
            currentIndustryRole={personalInfo?.industryRole || ""}
            onSave={handleIndustryRoleSave}
          />
          <ResumeEditorDialog
            open={isResumeDialogOpen}
            onOpenChange={setIsResumeDialogOpen}
            currentITResumeLink={personalInfo?.itResumeLink || ""}
            currentVAResumeLink={personalInfo?.vaResumeLink || ""}
            onSave={handleResumeSave}
          />
          <ContactInfoEditorDialog
            open={isContactInfoDialogOpen}
            onOpenChange={setIsContactInfoDialogOpen}
            // address
            currentCity={personalInfo?.city || ""}
            currentProvince={personalInfo?.province || ""}
            currentCountry={personalInfo?.country || ""}
            // contact
            currentEmail={personalInfo?.email || ""}
            currentContactNumber={personalInfo?.contactNumber || ""}
            currentLinkedinLink={personalInfo?.linkedinLink || ""}
            currentPortfolioLink={personalInfo?.portfolioLink || ""}
            currentGithubLink={personalInfo?.githubLink || ""}
            currentFacebookLink={personalInfo?.facebookLink || ""}
            currentInstagramLink={personalInfo?.instagramLink || ""}
            currentXLink={personalInfo?.xLink || ""}
            onSave={handleContactInfoSave}
          />
        </>
      )}
    </div>
  );
};

export default ProfileBasicInfo;
