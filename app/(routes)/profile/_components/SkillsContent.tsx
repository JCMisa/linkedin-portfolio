"use client";

import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useState } from "react";
import SkillsEditorDialog from "./dialogs/SkillsEditorDialog";

type SkillCategory = {
  id: string;
  title: string;
  description: string;
  items: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
};

interface SkillsContentProps {
  skills: SkillCategory[];
  userRole: string;
}

const SkillsContent = ({ skills, userRole }: SkillsContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isOwner = userRole === "admin" || userRole === "owner";

  return (
    <div
      id="skills"
      className={cn(
        "rounded-lg w-full bg-neutral-100 dark:bg-dark flex flex-col justify-between p-[10px] px-5 overflow-hidden relative transition-all duration-300 ease-in-out",
        isExpanded ? "max-h-[2000px]" : "max-h-[277px]"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-medium">Skills</h2>
        {isOwner && <SkillsEditorDialog currentSkills={skills} />}
      </div>

      <div className="flex flex-col gap-2 w-full pb-14">
        {skills.map((skill, index) => (
          <div
            key={skill.id}
            className={cn(
              "w-full flex flex-col py-3",
              index === skills.length - 1
                ? ""
                : "border-b border-neutral-200 dark:border-neutral-800"
            )}
          >
            <p className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              {skill.title}
            </p>
            <span className="text-xs italic text-muted-foreground mt-1">
              {skill.items.join(", ")}
            </span>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "cursor-pointer flex items-center gap-1 justify-center h-[44px] border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-dark z-10 w-full",
          !isExpanded ? "absolute bottom-0 left-0" : "mt-2"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <p className="text-sm font-semibold">
          {isExpanded ? "See Less" : "Show all skills"}
        </p>
        {isExpanded ? (
          <ArrowUpIcon className="size-4" />
        ) : (
          <ArrowDownIcon className="size-4" />
        )}
      </div>
    </div>
  );
};

export default SkillsContent;
