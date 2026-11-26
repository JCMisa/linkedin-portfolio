"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon, PenBoxIcon, ShieldCheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getActionError, type ActionResult } from "@/lib/action-result";
import { isAdminRole } from "@/lib/roles";
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
import {
  updateProfileImage,
  updateCoverImage,
  updateExperiences,
  updateName,
  updateIndustryRole,
  updateResume,
  updateContactInfo,
} from "@/features/profile/actions";
import { PersonalInfoType } from "@/db/schema";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { showConfetti } from "@/lib/confetti";
import {
  ContactInfoEditorDialog,
  ExperiencesEditorDialog,
  ImageEditorDialog,
  ResumeEditorDialog,
  TextFieldEditorDialog,
} from "@/features/profile/components/dialogs/admin-dialogs";
import type { ExperiencesType } from "@/db/schema";
import type { ContactInfoInput } from "../schemas";

interface ProfileBasicInfoProps {
  userRole?: string;
  personalInfo: PersonalInfoType;
}

const ProfileBasicInfo = ({
  userRole = "user",
  personalInfo: initialPersonalInfo,
}: ProfileBasicInfoProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCoverDialogOpen, setIsCoverDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isExperiencesDialogOpen, setIsExperiencesDialogOpen] = useState(false);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [isIndustryRoleDialogOpen, setIsIndustryRoleDialogOpen] =
    useState(false);
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
  const [isContactInfoDialogOpen, setIsContactInfoDialogOpen] = useState(false);
  const router = useRouter();
  const [personalInfo, setPersonalInfo] =
    useState<PersonalInfoType>(initialPersonalInfo);
  const isOwner = isAdminRole(userRole);

  /**
   * Applies an action result: on success merges the returned fields into local
   * state and refreshes server components; on failure throws so the editor
   * dialog can show the message.
   */
  const save = <T extends Partial<PersonalInfoType>>(
    result: ActionResult<T>,
    successMessage: string,
  ) => {
    const error = getActionError(result);
    if (error || !result?.data) throw new Error(error ?? "Save failed");
    const patch = result.data;
    setPersonalInfo((prev) => ({ ...prev, ...patch }));
    router.refresh();
    toast.success(successMessage);
    showConfetti();
  };

  const handleCoverImageSave = async (imageUrl: string | null) =>
    save(
      await updateCoverImage({ imageUrl }),
      "Cover image updated successfully",
    );

  const handleProfileImageSave = async (imageUrl: string | null) =>
    save(
      await updateProfileImage({ imageUrl }),
      "Profile image updated successfully",
    );

  const handleExperiencesSave = async (
    experiences: PersonalInfoType["experiences"],
  ) =>
    save(
      await updateExperiences({ experiences }),
      "Experiences updated successfully",
    );

  const handleNameSave = async (name: string) =>
    save(await updateName({ name }), "Name updated successfully");

  const handleIndustryRoleSave = async (industryRole: string) =>
    save(
      await updateIndustryRole({ industryRole }),
      "Industry role updated successfully",
    );

  const handleResumeSave = async (itResumeLink: string, vaResumeLink: string) =>
    save(
      await updateResume({ itResumeLink, vaResumeLink }),
      "Resumes saved successfully",
    );

  const handleContactInfoSave = async (contactInfo: ContactInfoInput) =>
    save(
      await updateContactInfo(contactInfo),
      "Contact info updated successfully",
    );

  const displayCoverImage = personalInfo?.coverImg || "/empty-img.webp";
  const displayProfileImage = personalInfo?.profileImg || "/empty-img.webp";

  // Find latest experience
  let latestExperience: ExperiencesType | null = null;
  if (
    personalInfo?.experiences &&
    Array.isArray(personalInfo.experiences) &&
    personalInfo.experiences.length > 0
  ) {
    const sorted = [...personalInfo.experiences].sort((a, b) => {
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
    <section
      aria-labelledby="profile-name"
      className="relative flex h-full w-full flex-col items-center rounded-lg bg-card lg:h-[400px]"
    >
      {/* cover photo */}
      <div className="relative h-[35%] w-full">
        <Image
          src={displayCoverImage}
          alt=""
          priority
          width={1000}
          height={1000}
          className="h-full w-full rounded-t-lg object-cover"
        />

        {isOwner && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Edit cover photo"
                onClick={() => setIsCoverDialogOpen(true)}
                className="absolute top-3 right-3 z-20 flex size-8 flex-none cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform duration-200 hover:scale-105"
              >
                <PenBoxIcon className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit cover photo</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* profile photo */}
      <div className="relative z-10 mt-[-70px] ml-[20px] flex items-start justify-start self-start sm:mt-[-100px]">
        <button
          type="button"
          aria-label="View profile photo"
          onClick={() => setIsProfileOpen(true)}
          className="cursor-zoom-in rounded-full"
        >
          <Image
            src={displayProfileImage}
            alt={`Profile photo of ${personalInfo?.name}`}
            width={304}
            height={304}
            priority
            className="h-[100px] w-[100px] rounded-full border-4 border-card object-cover sm:h-[152px] sm:w-[152px]"
          />
        </button>
        {isOwner && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Edit profile photo"
                onClick={() => setIsProfileDialogOpen(true)}
                className="absolute right-0 bottom-0 z-20 flex size-8 flex-none cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform duration-200 hover:scale-105"
              >
                <PenBoxIcon className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit profile photo</p>
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
                  <h1 id="profile-name" className="text-2xl font-semibold">
                    <button
                      type="button"
                      onClick={() => setIsNameDialogOpen(true)}
                      className="cursor-pointer rounded-sm text-left hover:opacity-80"
                    >
                      {personalInfo?.name}
                    </button>
                  </h1>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit name</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <h1 id="profile-name" className="text-2xl font-semibold">
                {personalInfo?.name}
              </h1>
            )}

            <div className="flex w-fit items-center gap-1 rounded-full border border-dashed border-primary px-3 text-primary">
              <ShieldCheckIcon className="size-4 text-primary" />
              <p className="text-sm font-bold">Profile Owner</p>
            </div>

            {isOwner ? (
              <Tooltip>
                <TooltipTrigger asChild disabled={!isOwner}>
                  <button
                    type="button"
                    onClick={() => setIsIndustryRoleDialogOpen(true)}
                    className="w-fit cursor-pointer rounded-sm text-left text-base hover:opacity-80"
                  >
                    {personalInfo?.industryRole || "Full-stack Developer 🚀"}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit industry role</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <p className="text-base">
                {personalInfo?.industryRole || "Full-stack Developer 🚀"}
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
                  className="cursor-pointer text-sm font-semibold text-primary hover:underline"
                >
                  Contact info
                </Link>
                {isOwner && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        aria-label="Edit address and contact info"
                        onClick={() => setIsContactInfoDialogOpen(true)}
                        className="flex size-5 flex-none cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform duration-200 hover:scale-105"
                      >
                        <PenBoxIcon className="size-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit address & contact info</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* number of connections */}
            <p className="text-sm font-bold text-primary">500+ connections</p>
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
                    alt=""
                    width={20}
                    height={20}
                    className="h-[20px] w-[20px] rounded-md object-fill"
                  />
                ) : (
                  <div className="h-[20px] w-[20px] rounded-md bg-muted" />
                )}
                {isOwner ? (
                  <button
                    type="button"
                    onClick={() => setIsExperiencesDialogOpen(true)}
                    className="cursor-pointer rounded-sm text-left text-sm font-semibold hover:opacity-80"
                  >
                    {latestExperience.title || "Untitled experience"}
                  </button>
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
                  alt=""
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
                alt=""
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
              Download resume
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
              rel="noopener noreferrer"
              className="rounded-sm text-sm transition-colors hover:text-primary hover:underline"
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
              rel="noopener noreferrer"
              className="rounded-sm text-sm transition-colors hover:text-primary hover:underline"
            >
              VA Resume
            </a>
            {isOwner && (
              <>
                <Separator />
                <button
                  type="button"
                  onClick={() => setIsResumeDialogOpen(true)}
                  className="cursor-pointer rounded-sm text-left text-sm transition-colors hover:text-primary hover:underline"
                >
                  Edit resume
                </button>
              </>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* profile image full screen view */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="w-auto max-w-[min(90vw,40rem)] border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">
            Profile photo of {personalInfo?.name}
          </DialogTitle>
          <Image
            src={displayProfileImage}
            alt={`Profile photo of ${personalInfo?.name}`}
            width={640}
            height={640}
            className="h-auto max-h-[85vh] w-full rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>

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
            currentExperiences={personalInfo.experiences ?? []}
            onSave={handleExperiencesSave}
          />
          <TextFieldEditorDialog
            open={isNameDialogOpen}
            onOpenChange={setIsNameDialogOpen}
            title="Edit name"
            label="Name"
            value={personalInfo.name}
            maxLength={100}
            onSave={handleNameSave}
          />
          <TextFieldEditorDialog
            open={isIndustryRoleDialogOpen}
            onOpenChange={setIsIndustryRoleDialogOpen}
            title="Edit industry role"
            label="Industry role"
            placeholder="e.g. Front-End Developer"
            value={personalInfo.industryRole}
            maxLength={150}
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
            values={{
              city: personalInfo.city,
              province: personalInfo.province,
              country: personalInfo.country,
              email: personalInfo.email,
              contactNumber: personalInfo.contactNumber,
              linkedinLink: personalInfo.linkedinLink,
              portfolioLink: personalInfo.portfolioLink,
              githubLink: personalInfo.githubLink,
              facebookLink: personalInfo.facebookLink,
              instagramLink: personalInfo.instagramLink,
              xLink: personalInfo.xLink,
            }}
            onSave={handleContactInfoSave}
          />
        </>
      )}
    </section>
  );
};

export default ProfileBasicInfo;
