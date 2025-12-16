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
} from "@/lib/actions/profileInfo";
import { PersonalInfoType } from "@/config/schema";
import NameEditorDialog from "./dialogs/NameEditorDialog";
import IndustryRoleEditorDialog from "./dialogs/IndustryRoleEditorDialog";
import ResumeEditorDialog from "./dialogs/ResumeEditorDialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { showConfetti } from "@/lib/utils";

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
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType | null>(
    null
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
          prev ? { ...prev, coverImg: savedUrl } : null
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
          prev ? { ...prev, profileImg: savedUrl } : null
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
            : null
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
          prev ? { ...prev, name: result.name || updatedName } : null
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
            : null
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
    updatedVAResumeLink: string
  ) => {
    try {
      const result = await updateResume(
        updatedITResumeLink,
        updatedVAResumeLink
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
            : null
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

  // todo: handle address update

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
    <div className="rounded-lg w-full md:h-[400px] h-full bg-neutral-100 dark:bg-dark flex flex-col items-center relative">
      {/* cover photo */}
      <div className="h-[35%] w-full relative">
        <Image
          src={displayCoverImage}
          alt="cover-img"
          width={1000}
          height={1000}
          className="w-full h-full object-cover rounded-t-lg"
        />

        {isOwner && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={() => setIsCoverDialogOpen(true)}
                className="flex-none flex items-center justify-center rounded-full w-8 h-8 cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out shadow-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black absolute top-3 right-3 z-20"
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

      <div
        onClick={() => setIsProfileOpen(true)}
        className="cursor-pointer sm:mt-[-100px] mt-[-70px] flex items-start justify-start self-start ml-[20px] z-10 relative"
      >
        {/* profile photo */}
        <Image
          src={displayProfileImage}
          alt="profile-img"
          width={1000}
          height={1000}
          className="sm:w-[152px] sm:h-[152px] w-[100px] h-[100px] object-fill rounded-full border-3 border-white dark:border-dark "
        />
        {isOwner && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileDialogOpen(true);
                }}
                className="flex-none flex items-center justify-center rounded-full w-8 h-8 cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out shadow-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black absolute bottom-0 right-0 z-20"
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
      <div className="h-full w-full p-[10px] overflow-auto no-scrollbar ">
        <div className="px-5 flex flex-col lg:flex-row items-start gap-2 justify-between">
          <div className=" flex flex-col gap-[5px]">
            {isOwner ? (
              <Tooltip>
                <TooltipTrigger asChild disabled={!isOwner}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsNameDialogOpen(true);
                    }}
                    className="text-2xl font-bold hover:opacity-[0.8] transition-all ease-linear duration-200 cursor-pointer"
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

            <div className="border-blue-400 text-blue-400 border border-dashed px-3 flex items-center gap-1 rounded-full w-fit">
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
                    className="text-sm hover:opacity-[0.8] transition-all ease-linear duration-200 cursor-pointer"
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

            <p className=" my-2">
              <span className="text-sm text-muted-foreground">
                San Pablo, Calabarzon, Philippines
              </span>{" "}
              •{" "}
              <Link
                href={"/contact"}
                className="text-sm underline cursor-pointer text-blue-300"
              >
                Contact Info
              </Link>
            </p>

            {/* number of users signed in */}
            <p className="text-sm font-bold text-blue-400">500+ connections</p>
          </div>

          {/* experience and education */}
          <div className="flex flex-col gap-2 relative">
            {isOwner && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => setIsExperiencesDialogOpen(true)}
                    className="flex-none flex items-center justify-center rounded-full w-6 h-6 cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out shadow-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black absolute -top-1 -right-1 z-10"
                  >
                    <PenBoxIcon className="size-3" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Experiences</p>
                </TooltipContent>
              </Tooltip>
            )}

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
                    className="w-[20px] h-[20px] object-fill rounded-md"
                  />
                ) : (
                  <div className="w-[20px] h-[20px] rounded-md bg-neutral-300 dark:bg-neutral-700" />
                )}
                <Link
                  href={`/experiences`}
                  className="font-bold text-sm max-w-[300px] truncate hover:text-blue-400 transition-all duration-200 ease-in-out hover:underline"
                >
                  {latestExperience.title || "Untitled Experience"}
                </Link>
              </div>
            ) : (
              // fallback latest experience
              <div className="flex items-center gap-1">
                <Image
                  src={"/ptp.webp"}
                  alt="school-img"
                  width={1000}
                  height={1000}
                  className="w-[20px] h-[20px] object-fill rounded-md"
                />
                <p className="font-bold text-sm uppercase">
                  PHILADELPHIA TRUCK PARTS{" "}
                  <span className="text-[9px] text-muted-foreground italic">
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
                className="w-[20px] h-[20px] object-fill rounded-md"
              />
              <p className="font-bold text-sm ">
                Laguna State Polytechnic University - San Pablo City
              </p>
            </div>
          </div>
        </div>

        {/* download resume */}
        <Popover>
          <PopoverTrigger asChild className="hidden md:flex">
            <Button
              className="text-xs hidden md:flex items-center justify-center gap-1 cursor-pointer absolute bottom-2 right-2"
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
              className="cursor-pointer text-sm hover:text-blue-400 transition-all duration-200 ease-in-out"
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
              className="cursor-pointer text-sm hover:text-blue-400 transition-all duration-200 ease-in-out"
            >
              VA Resume
            </a>
            {isOwner && (
              <>
                <Separator />
                <div
                  onClick={() => setIsResumeDialogOpen(true)}
                  className="cursor-pointer text-sm hover:text-blue-400 transition-all duration-200 ease-in-out"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setIsProfileOpen(false)}
        >
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl z-50"
            >
              &times;
            </button>
            <Image
              src={displayProfileImage}
              alt="profile-img"
              width={1000}
              height={1000}
              className="max-w-screen-lg max-h-screen-lg p-8"
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
        </>
      )}
    </div>
  );
};

export default ProfileBasicInfo;
