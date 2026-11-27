"use client";

import { useCurrentUser } from "@/features/users/hooks";

import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useState } from "react";
import { SkillsEditorDialog } from "@/features/profile/components/dialogs/admin-dialogs";

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
}

const SkillsContent = ({ skills }: SkillsContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isAdmin: isOwner } = useCurrentUser();

  return (
    <div
      id="skills"
      className={cn(
        "relative flex w-full flex-col justify-between overflow-hidden rounded-lg bg-card p-[10px] px-5 transition-all duration-300 ease-in-out",
        isExpanded ? "max-h-[2000px]" : "max-h-[277px]",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Skills</h2>
        {isOwner && <SkillsEditorDialog currentSkills={skills} />}
      </div>

      <div className="flex w-full flex-col gap-2 pb-14">
        {skills.map((skill, index) => (
          <div
            key={skill.id}
            className={cn(
              "flex w-full flex-col py-3",
              index === skills.length - 1 ? "" : "border-b border-border",
            )}
          >
            <p className="text-sm font-bold text-foreground">{skill.title}</p>
            <span className="mt-1 text-xs text-muted-foreground italic">
              {skill.items.join(", ")}
            </span>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "z-10 flex h-[44px] w-full cursor-pointer items-center justify-center gap-1 border-t border-border bg-card",
          !isExpanded ? "absolute bottom-0 left-0" : "mt-2",
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
