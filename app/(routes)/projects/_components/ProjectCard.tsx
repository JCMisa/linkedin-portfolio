"use client";

import Image from "next/image";
import Link from "next/link";
import DeleteProject from "@/components/custom/DeleteProject";
import EditProject from "@/components/custom/EditProject";
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

const ProjectCard = memo(
  ({
    project,
    currentUserRole,
  }: {
    project: ProjectType;
    currentUserRole: string;
  }) => {
    return (
      <div className="inter-var h-full">
        <div className="bg-neutral-200 relative group/card dark:hover:shadow-2xl dark:hover:shadow-primary-500/[0.1] dark:bg-dark dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl p-6 border flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="text-xl font-bold text-neutral-600 dark:text-white line-clamp-1">
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
          <div className="text-neutral-500 text-sm mt-2 dark:text-neutral-300 h-[40px]">
            <p className="line-clamp-2 whitespace-pre-wrap">
              {project.description || "No description provided"}
            </p>
          </div>

          {/* Project Image */}
          <div className="w-full mt-4 flex-grow">
            <Image
              src={project.image || "/empty-img.webp"}
              height={400}
              width={600}
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </div>

          {/* Links & Details Section */}
          <div className="flex flex-col gap-4 mt-5">
            <div className="flex justify-between items-center gap-2">
              <Button
                asChild
                variant="outline"
                className="px-4 py-2 rounded-md text-xs font-normal min-w-[100px] flex-1 cursor-pointer"
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
                className="px-4 py-2 rounded-md bg-primary text-white text-xs font-bold min-w-[100px] flex-1 cursor-pointer"
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
                className="px-4 py-2 rounded-md text-xs font-bold min-w-[120px] flex-1 cursor-pointer"
              >
                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-1 justify-center"
                >
                  <EyeIcon className="size-3" />
                  <p className="hidden sm:block">Details</p>
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Popover>
                <PopoverTrigger className="cursor-pointer flex items-center gap-1 hover:opacity-[0.8] transition-opacity text-blue-400">
                  <p className="text-sm underline">Tech Stack</p>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <span className="text-xs text-muted-foreground max-w-sm">
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
                    className="text-sm flex items-center gap-2"
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

export default ProjectCard;
