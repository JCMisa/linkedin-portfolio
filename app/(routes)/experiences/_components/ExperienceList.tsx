"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  BriefcaseIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PenBoxIcon,
  PlusIcon,
} from "lucide-react";
import { SingleExperienceEditorDialog } from "@/app/(routes)/profile/_components/dialogs/SingleExperienceEditorDialog";
import { updateExperiences } from "@/lib/actions/profileInfo";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

// --------------------------------------------- types and interfaces ---------------------------------------------
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

interface ExperienceContentWrapperProps {
  experience: ExperienceType;
  isOwner: boolean;
  onSave: (updatedExp: ExperienceType) => Promise<void>;
}

interface ExperienceItemProps {
  experience: ExperienceType;
  isLast: boolean;
  isOwner: boolean;
  handleUpdateExperience: (updatedExp: ExperienceType) => Promise<void>;
}

interface ExperienceListProps {
  initialExperiences: ExperienceType[];
  userRole?: string;
}
// --------------------------------------------- types and interfaces ---------------------------------------------

// --------------------------------------------- helper functions ---------------------------------------------
const formatDate = (dateStr: string) => {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const getDuration = (from: string, to: string) => {
  const start = new Date(from);
  const end = to ? new Date(to) : new Date();
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years > 0 && remainingMonths > 0)
    return `${years} yr ${remainingMonths} mos`;
  if (years > 0) return `${years} yr`;
  return `${remainingMonths} mos`;
};
// --------------------------------------------- helper functions ---------------------------------------------

const ExperienceItem = ({
  experience,
  isLast,
  isOwner,
  handleUpdateExperience,
}: ExperienceItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const isCurrent =
    !experience.dateTo || new Date(experience.dateTo) >= new Date();
  const descLines = experience.description;
  const shouldTruncate = descLines.length > 150;

  return (
    <div className="flex gap-3 sm:gap-4 relative group">
      <div className="absolute top-[5px] right-[5px]">
        <ExperienceContentWrapper
          experience={experience}
          isOwner={isOwner}
          onSave={handleUpdateExperience}
        />
      </div>

      {/* Timeline column */}
      <div className="flex flex-col items-center pt-1 flex-shrink-0">
        <div
          className={
            isCurrent
              ? "w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20 flex-shrink-0 animate-pulse"
              : "w-3 h-3 rounded-full bg-primary ring-4 ring-card flex-shrink-0"
          }
        />
        {!isLast && <div className="w-[2px] flex-1 bg-border mt-2" />}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-8 ${isLast ? "pb-0" : ""}`}>
        <div className="bg-card rounded-lg border border-border shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow duration-200">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-accent dark:bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BriefcaseIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight">
                {experience.title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                <span className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {formatDate(experience.dateFrom)} –{" "}
                  {formatDate(experience.dateTo)}
                </span>
                <span className="text-xs text-muted-foreground">
                  · {getDuration(experience.dateFrom, experience.dateTo)}
                </span>
              </div>
              {isCurrent && (
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Current
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-3 pl-0 sm:pl-[60px]">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {shouldTruncate && !expanded
                ? descLines.slice(0, 150) + "..."
                : descLines}
            </p>
            {shouldTruncate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="mt-1 px-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent text-xs font-semibold"
              >
                {expanded ? (
                  <>
                    Show less <ChevronUpIcon className="w-3.5 h-3.5 ml-1" />
                  </>
                ) : (
                  <>
                    Show more <ChevronDownIcon className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Banner image */}
          {experience.bannerImg && (
            <div className="mt-3 pl-0 sm:pl-[60px]">
              <img
                src={experience.bannerImg}
                alt={experience.title}
                className="w-full rounded-lg border border-border object-cover max-h-48"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ExperienceList = ({
  initialExperiences,
  userRole = "user",
}: ExperienceListProps) => {
  const isOwner = userRole === "admin" || userRole === "owner";

  const [experiences, setExperiences] = useState<ExperienceType[]>(
    initialExperiences || [],
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const sortedExperiences = [...experiences].sort((a, b) => {
    const aIsCurrent = !a.dateTo || new Date(a.dateTo) >= new Date();
    const bIsCurrent = !b.dateTo || new Date(b.dateTo) >= new Date();
    if (aIsCurrent && !bIsCurrent) return -1;
    if (!aIsCurrent && bIsCurrent) return 1;
    return new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime();
  });

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
      exp.id === updatedExp.id ? updatedExp : exp,
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

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      {/* Section header */}
      <div className="flex items-center justify-between p-4 sm:p-6 pb-0 sm:pb-0">
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Experience</h2>
        </div>
        {/* <span className="text-xs text-muted-foreground">
          {experiences.length} position{experiences.length !== 1 ? "s" : ""}
        </span> */}
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

      <div className="p-4 sm:p-6 pt-4">
        {sortedExperiences.map((exp, index) => (
          <ExperienceItem
            key={exp.id}
            experience={exp}
            isLast={index === sortedExperiences.length - 1}
            isOwner={isOwner}
            handleUpdateExperience={handleUpdateExperience}
          />
        ))}
      </div>
    </div>
  );
};

// Wrapper to handle the dialog state locally for each item
const ExperienceContentWrapper = ({
  experience,
  isOwner,
  onSave,
}: ExperienceContentWrapperProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {isOwner && (
        <div className="ml-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="h-8 w-8 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full p-2 flex-none"
                onClick={() => setIsDialogOpen(true)}
              >
                <PenBoxIcon className="size-4 text-neutral-500" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Experience</p>
            </TooltipContent>
          </Tooltip>

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
