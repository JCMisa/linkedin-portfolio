"use client";

import Image from "next/image";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BriefcaseIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PenBoxIcon,
  PlusIcon,
} from "lucide-react";
import { SingleExperienceEditorDialog } from "@/features/profile/components/dialogs/admin-dialogs";
import { updateExperiences } from "@/features/profile/actions";
import { toast } from "sonner";
import { getActionError } from "@/lib/action-result";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
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
    <div className="group relative flex gap-3 sm:gap-4">
      <div className="absolute top-[5px] right-[5px]">
        <ExperienceContentWrapper
          experience={experience}
          isOwner={isOwner}
          onSave={handleUpdateExperience}
        />
      </div>

      {/* Timeline column */}
      <div className="flex flex-shrink-0 flex-col items-center pt-1">
        <div
          className={
            isCurrent
              ? "h-3 w-3 flex-shrink-0 animate-pulse rounded-full bg-primary ring-4 ring-primary/20"
              : "h-3 w-3 flex-shrink-0 rounded-full bg-primary ring-4 ring-card"
          }
        />
        {!isLast && <div className="mt-2 w-[2px] flex-1 bg-border" />}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-8 ${isLast ? "pb-0" : ""}`}>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-5">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent dark:bg-primary/10">
              <BriefcaseIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm leading-tight font-semibold text-foreground sm:text-base">
                {experience.title}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {formatDate(experience.dateFrom)} –{" "}
                  {formatDate(experience.dateTo)}
                </span>
                <span className="text-xs text-muted-foreground">
                  · {getDuration(experience.dateFrom, experience.dateTo)}
                </span>
              </div>
              {isCurrent && (
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  Current
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-3 pl-0 sm:pl-[60px]">
            <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
              {shouldTruncate && !expanded
                ? descLines.slice(0, 150) + "..."
                : descLines}
            </p>
            {shouldTruncate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="mt-1 h-auto px-0 text-xs font-semibold text-primary hover:bg-transparent hover:text-primary/80"
              >
                {expanded ? (
                  <>
                    Show less <ChevronUpIcon className="ml-1 h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    Show more <ChevronDownIcon className="ml-1 h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Banner image */}
          {experience.bannerImg && (
            <div className="mt-3 pl-0 sm:pl-[60px]">
              <div className="relative h-48 w-full overflow-hidden rounded-lg border border-border">
                <Image
                  src={experience.bannerImg}
                  alt={experience.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 640px"
                  className="object-cover"
                />
              </div>
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
      const result = await updateExperiences({ experiences: newExperiences });
      const error = getActionError(result);
      if (!error && result?.data) {
        setExperiences(result.data.experiences as ExperienceType[]);
        toast.success("Experience added successfully");
      } else {
        setExperiences(experiences); // Revert
        toast.error(error ?? "Failed to add experience");
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
      const result = await updateExperiences({ experiences: newExperiences });
      const error = getActionError(result);
      if (!error && result?.data) {
        // Sync with the server's normalized data (dates etc.)
        setExperiences(result.data.experiences as ExperienceType[]);
      } else {
        setExperiences(experiences); // Revert on error
        toast.error(error ?? "Failed to update");
      }
    } catch (error) {
      console.error("Failed to update experience", error);
      setExperiences(experiences); // Revert
      toast.error("Failed to save changes.");
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      {/* Section header */}
      <div className="flex items-center justify-between p-4 pb-0 sm:p-6 sm:pb-0">
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="h-5 w-5 text-primary" />
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
              title="Add experience"
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

      <div className="p-4 pt-4 sm:p-6">
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
                className="h-8 w-8 flex-none rounded-full p-2 hover:bg-accent"
                onClick={() => setIsDialogOpen(true)}
              >
                <PenBoxIcon className="size-4 text-muted-foreground" />
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
