"use client";

import { AdminOnly } from "@/features/users/components/AdminOnly";

import Image from "next/image";
import Link from "next/link";
import { DeleteProject, ProjectFormDialog } from "./admin-dialogs";
import { Button } from "@/components/ui/button";
import { LinkPreview } from "@/components/ui/link-preview";
import { EyeIcon, GlobeIcon, MoreHorizontalIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { memo } from "react";
import { FaGithub } from "react-icons/fa";

const ProjectGridCard = memo(({ project }: { project: ProjectType }) => {
  return (
    <div className="inter-var h-full">
      <article className="group/card relative flex h-full w-full flex-col rounded-lg border bg-card p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h2
            title={project.title}
            className="line-clamp-1 text-base font-semibold text-foreground"
          >
            {project.title}
          </h2>
          <AdminOnly>
            <div className="flex items-center gap-2">
              <ProjectFormDialog project={project} />
              <DeleteProject project={project} />
            </div>
          </AdminOnly>
        </div>

        {/* Description - Fixed height via line-clamp */}
        <div className="mt-2 h-[40px] text-sm text-muted-foreground">
          <p className="line-clamp-2 whitespace-pre-wrap">
            {project.description || "No description provided"}
          </p>
        </div>

        {/* Project Image */}
        <div className="mt-4 w-full flex-grow">
          <Image
            src={project.image || "/empty-img.webp"}
            height={400}
            width={600}
            className="h-60 w-full rounded-md object-cover group-hover/card:shadow-xl"
            alt={`${project.title} preview`}
          />
        </div>

        {/* Links & Details Section */}
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <Button
              asChild
              variant="outline"
              className="min-w-0 flex-1 px-2 text-xs"
            >
              <LinkPreview
                url={project.githubLink || "#"}
                className={
                  !project.githubLink
                    ? "text-muted-foreground line-through"
                    : ""
                }
              >
                <FaGithub className="size-3" />
                GitHub
              </LinkPreview>
            </Button>

            <Button asChild className="min-w-0 flex-1 px-2 text-xs">
              <LinkPreview
                url={project.liveLink || "#"}
                className={
                  !project.liveLink ? "text-muted-foreground line-through" : ""
                }
              >
                <GlobeIcon className="size-3" />
                Live
              </LinkPreview>
            </Button>

            {/* NEW: View Details Button */}
            <Button
              asChild
              variant="secondary"
              className="min-w-0 flex-1 px-2 text-xs"
            >
              <Link
                href={`/projects/${project.id}`}
                className="flex items-center justify-center gap-1"
              >
                <EyeIcon className="size-3" />
                Details
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Popover>
              <PopoverTrigger className="flex cursor-pointer items-center gap-1 text-primary transition-opacity hover:opacity-[0.8]">
                <p className="text-sm underline">Tech Stack</p>
              </PopoverTrigger>
              <PopoverContent align="start">
                <span className="max-w-sm text-xs text-muted-foreground">
                  {project.techStacks?.join(" | ") || "No tech stacks"}
                </span>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger
                aria-label="More options"
                className="flex rounded-full p-1 hover:bg-accent sm:hidden"
              >
                <MoreHorizontalIcon className="size-4" />
              </PopoverTrigger>
              <PopoverContent align="end" className="flex flex-col gap-2">
                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-2 text-sm"
                >
                  <EyeIcon className="size-4" /> View details
                </Link>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </article>
    </div>
  );
});

ProjectGridCard.displayName = "ProjectGridCard";

export default ProjectGridCard;
