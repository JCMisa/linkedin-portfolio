"use client";

import Image from "next/image";
import Link from "next/link";
import DeleteProject from "./DeleteProject";
import EditProject from "./EditProject";
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

const ProjectGridCard = memo(
  ({
    project,
    currentUserRole,
  }: {
    project: ProjectType;
    currentUserRole: string;
  }) => {
    return (
      <div className="inter-var h-full">
        <div className="group/card relative flex h-full w-full flex-col rounded-xl border border-black/[0.1] bg-neutral-200 p-6 dark:border-white/[0.2] dark:bg-dark dark:hover:shadow-2xl dark:hover:shadow-primary-500/[0.1]">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="line-clamp-1 text-xl font-bold text-neutral-600 dark:text-white">
              {project.title}
            </div>
            {currentUserRole === "admin" && (
              <div className="flex items-center gap-2">
                <EditProject project={project} />
                <DeleteProject project={project} />
              </div>
            )}
          </div>

          {/* Description - Fixed height via line-clamp */}
          <div className="mt-2 h-[40px] text-sm text-neutral-500 dark:text-neutral-300">
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
              className="h-60 w-full rounded-xl object-cover group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </div>

          {/* Links & Details Section */}
          <div className="mt-5 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <Button
                asChild
                variant="outline"
                className="min-w-[100px] flex-1 cursor-pointer rounded-md px-4 py-2 text-xs font-normal"
              >
                <LinkPreview
                  url={project.githubLink || "#"}
                  className={
                    !project.githubLink ? "text-gray-400 line-through" : ""
                  }
                >
                  <FaGithub className="size-3" />
                  <p className="hidden sm:block">Github</p>
                </LinkPreview>
              </Button>

              <Button
                asChild
                className="min-w-[100px] flex-1 cursor-pointer rounded-md bg-primary px-4 py-2 text-xs font-bold text-white"
              >
                <LinkPreview
                  url={project.liveLink || "#"}
                  className={
                    !project.liveLink ? "text-gray-400 line-through" : ""
                  }
                >
                  <GlobeIcon className="size-3" />
                  <p className="hidden sm:block">Live</p>
                </LinkPreview>
              </Button>

              {/* NEW: View Details Button */}
              <Button
                asChild
                variant="secondary"
                className="min-w-[120px] flex-1 cursor-pointer rounded-md px-4 py-2 text-xs font-bold"
              >
                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-center gap-1"
                >
                  <EyeIcon className="size-3" />
                  <p className="hidden sm:block">Details</p>
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Popover>
                <PopoverTrigger className="flex cursor-pointer items-center gap-1 text-blue-400 transition-opacity hover:opacity-[0.8]">
                  <p className="text-sm underline">Tech Stack</p>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <span className="max-w-sm text-xs text-muted-foreground">
                    {project.techStacks?.join(" | ") || "No tech stacks"}
                  </span>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger className="flex sm:hidden">
                  <MoreHorizontalIcon className="size-4" />
                </PopoverTrigger>
                <PopoverContent align="end" className="flex flex-col gap-2">
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-2 text-sm"
                  >
                    <EyeIcon className="size-4" /> View Details
                  </Link>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ProjectGridCard.displayName = "ProjectGridCard";

export default ProjectGridCard;
