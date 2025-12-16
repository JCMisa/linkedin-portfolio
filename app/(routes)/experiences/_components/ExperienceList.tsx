"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PenBoxIcon, PlusIcon } from "lucide-react";
import { SingleExperienceEditorDialog } from "@/app/(routes)/profile/_components/dialogs/SingleExperienceEditorDialog";
import { updateExperiences } from "@/lib/actions/profileInfo";
import { toast } from "sonner";

type ExperienceType = {
  id: string;
  title: string;
  description: string;
  bannerImg: string;
  dateFrom: string;
  dateTo: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

interface ExperienceContentProps {
  experience: ExperienceType;
  isOwner: boolean;
  onSave: (updatedExp: ExperienceType) => Promise<void>;
}

const ExperienceContent = ({
  experience,
  isOwner,
  onSave,
}: ExperienceContentProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="relative group">
      {isOwner && (
        <>
          <TooltipWrapper text="Edit Experience">
            <Button
              onClick={() => setIsDialogOpen(true)}
              size="icon"
              variant="secondary"
              className="absolute -top-10 right-0 md:-top-2 md:right-0 z-10 w-8 h-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <PenBoxIcon className="size-4" />
            </Button>
          </TooltipWrapper>
          <SingleExperienceEditorDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            experience={experience}
            onSave={onSave}
          />
        </>
      )}

      <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
        {experience.description}
      </p>

      {experience.bannerImg && (
        <div className="relative w-full h-40 md:h-60 lg:h-80 rounded-lg overflow-hidden shadow-md">
          <Image
            src={experience.bannerImg}
            alt={experience.title}
            fill
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
};

// Small helper for tooltip to avoid clutter
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const TooltipWrapper = ({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

interface ExperienceListProps {
  initialExperiences: ExperienceType[];
  userRole?: string;
}

const ExperienceList = ({
  initialExperiences,
  userRole = "user",
}: ExperienceListProps) => {
  const [experiences, setExperiences] = useState<ExperienceType[]>(
    initialExperiences || []
  );

  const isOwner = userRole === "admin" || userRole === "owner";
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddExperience = async (newExp: ExperienceType) => {
    // 1. Optimistically update state
    const newExperiences = [newExp, ...experiences];
    setExperiences(newExperiences);

    // 2. Call server action
    try {
      const result = await updateExperiences(newExperiences);
      if (typeof result === "object" && result?.success) {
        if (result.experiences) {
          setExperiences(result.experiences as ExperienceType[]);
        }
        toast.success("Experience added successfully");
      } else {
        setExperiences(experiences); // Revert
        const errorMsg =
          typeof result === "string"
            ? result
            : result?.error || "Failed to add experience";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Failed to add experience", error);
      setExperiences(experiences); // Revert
      toast.error("Failed to save changes.");
    }
  };

  const handleUpdateExperience = async (updatedExp: ExperienceType) => {
    // 1. Optimistically update state
    const newExperiences = experiences.map((exp) =>
      exp.id === updatedExp.id ? updatedExp : exp
    );
    setExperiences(newExperiences);

    // 2. Call server action
    try {
      const result = await updateExperiences(newExperiences);
      if (typeof result === "object" && result?.success) {
        // Already updated state, maybe sync with server response if needed (date formats etc)
        if (result.experiences) {
          setExperiences(result.experiences as ExperienceType[]);
        }
      } else {
        // Revert on error
        setExperiences(experiences);
        const errorMsg =
          typeof result === "string"
            ? result
            : result?.error || "Failed to update";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Failed to update experience", error);
      setExperiences(experiences); // Revert
      toast.error("Failed to save changes.");
    }
  };

  // Convert to Timeline data format
  // Sort by date (newest first)
  const sortedExperiences = [...experiences].sort((a, b) => {
    // Logic: Current (no dateTo or future) > Past
    // Within same category, sort by dateFrom desc
    const aIsCurrent = !a.dateTo || new Date(a.dateTo) >= new Date();
    const bIsCurrent = !b.dateTo || new Date(b.dateTo) >= new Date();

    if (aIsCurrent && !bIsCurrent) return -1;
    if (!aIsCurrent && bIsCurrent) return 1;

    const dateA = new Date(a.dateFrom || 0).getTime();
    const dateB = new Date(b.dateFrom || 0).getTime();
    return dateB - dateA;
  });

  return (
    <div className="flex flex-col gap-0 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Experience
        </h2>
        {isOwner && (
          <>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              size="sm"
              className="gap-2"
            >
              <PlusIcon className="size-4" />
              Add Experience
            </Button>
            <SingleExperienceEditorDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              experience={{
                id: crypto.randomUUID(),
                title: "",
                description: "",
                bannerImg: "",
                dateFrom: "",
                dateTo: "",
                createdAt: new Date(),
                updatedAt: new Date(),
              }}
              onSave={handleAddExperience}
            />
          </>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {sortedExperiences.map((exp, index) => {
          const startDate = exp.dateFrom
            ? new Date(exp.dateFrom).getFullYear()
            : "N/A";
          const isCurrent = !exp.dateTo || new Date(exp.dateTo) >= new Date();
          const endDate = isCurrent
            ? "Present"
            : new Date(exp.dateTo).getFullYear();
          const isLast = index === sortedExperiences.length - 1;

          return (
            <div
              key={exp.id}
              className="flex gap-4 group relative bg-neutral-100 dark:bg-dark p-4 rounded-lg shadow-lg"
            >
              {/* Left Column: Line & Dot/Image */}
              <div className="flex flex-col items-center">
                {/* Image/Logo */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shrink-0">
                  {exp.bannerImg ? (
                    <Image
                      src={exp.bannerImg}
                      alt={exp.title}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800" />
                  )}
                </div>
                {/* Connecting Line */}
                {!isLast && (
                  <div className="w-[2px] h-full bg-neutral-800 dark:bg-neutral-200 my-2" />
                )}
              </div>

              {/* Right Column: Content */}
              <div className="flex-1 pb-12">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      {exp.title}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {startDate} - {endDate}
                    </p>
                  </div>
                  {/* Reuse ExperienceContent logic properly */}
                  <ExperienceContentWrapper
                    experience={exp}
                    isOwner={isOwner}
                    onSave={handleUpdateExperience}
                  />
                </div>

                {/* Description */}
                <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                  {exp.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Wrapper to handle the dialog state locally for each item
const ExperienceContentWrapper = ({
  experience,
  isOwner,
  onSave,
}: ExperienceContentProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {isOwner && (
        <div className="ml-2">
          <TooltipWrapper text="Edit Experience">
            <Button
              onClick={() => setIsDialogOpen(true)}
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
            >
              <PenBoxIcon className="size-4 text-neutral-500" />
            </Button>
          </TooltipWrapper>
          <SingleExperienceEditorDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            experience={experience}
            onSave={onSave}
          />
        </div>
      )}
    </>
  );
};

export default ExperienceList;
