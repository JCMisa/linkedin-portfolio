"use client";

import { Separator } from "@/components/ui/separator";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DotIcon,
  EarthIcon,
  EyeIcon,
  MessageSquareMoreIcon,
  MoreHorizontalIcon,
  SendIcon,
  ThumbsUpIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toggleProjectLike } from "@/lib/actions/likes";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateComment from "@/components/custom/CreateComment";
import { useUser } from "@clerk/nextjs";
import EditProject from "@/components/custom/EditProject";
import DeleteProject from "@/components/custom/DeleteProject";
import { PersonalInfoType, ProjectsType } from "@/config/schema";
import { handleShare } from "@/lib/utils";

// Define the extended type that comes from your optimized server action
interface OptimizedProject extends ProjectsType {
  likesCount: number;
  hasLiked: boolean;
  commentsCount: number;
  latestCommenter: { name: string; image: string } | null;
}

const ProjectCard = ({
  project,
  userRole,
  personalInfo,
}: {
  project: OptimizedProject;
  userRole: string;
  personalInfo: PersonalInfoType;
}) => {
  const { user } = useUser();

  // 1. Initialize state directly from Server Props (No useEffect needed!)
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(project.hasLiked);
  const [likesCount, setLikesCount] = useState(project.likesCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeClick = async () => {
    if (!user || isLoading) return;

    setIsLoading(true);
    // Optimistic update
    const previousIsLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!previousIsLiked);
    setLikesCount((prev) => (previousIsLiked ? prev - 1 : prev + 1));

    try {
      const result = await toggleProjectLike(project.id);
      if (!result.success) {
        // Revert on failure
        setIsLiked(previousIsLiked);
        setLikesCount(previousCount);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setIsLiked(previousIsLiked);
      setLikesCount(previousCount);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-neutral-100 dark:bg-dark flex flex-col items-start gap-3 rounded-lg py-2 px-3 overflow-hidden border border-transparent hover:border-border transition-all">
      {/* 2. Header: Latest Commenter (Now instant from Props) */}
      <div className="flex items-center gap-2 justify-between w-full">
        <div className="flex items-center gap-2">
          {project.latestCommenter ? (
            <>
              <Image
                src={project.latestCommenter.image || "/empty-img.webp"}
                alt="commenter"
                width={24}
                height={24}
                className="w-6 h-6 object-cover rounded-full"
              />
              <p className="text-[9px]">
                {project.latestCommenter.name}{" "}
                <span className="text-muted-foreground">
                  recently commented on this
                </span>
              </p>
            </>
          ) : (
            <p className="text-[9px] text-muted-foreground">No comments yet</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {userRole === "admin" && (
            <>
              <EditProject project={project} />
              <DeleteProject project={project} />
            </>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/projects`}>
                <ChevronRightIcon className="size-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>More Projects</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Separator />

      {/* 3. Content Header */}
      <div className="flex items-center justify-between w-full px-2">
        <div className="flex items-start gap-2">
          <Image
            src={personalInfo.profileImg || "/empty-img.webp"}
            alt={personalInfo.name}
            width={48}
            height={48}
            className="w-12 h-12 object-cover rounded-full flex-none"
          />
          <div className="flex flex-col max-w-[80%]">
            <p className="text-sm font-bold capitalize ">{project.title}</p>
            <span className="text-xs text-muted-foreground ">
              {project.techStacks && project.techStacks.length > 0
                ? project.techStacks.join(" | ")
                : "No tech stacks"}
            </span>
            <span className="text-xs text-muted-foreground flex items-center mt-1">
              {Math.ceil(
                (Date.now() - new Date(project.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24),
              )}
              d <DotIcon className="size-4" /> <EarthIcon className="size-4" />
            </span>
          </div>
        </div>

        <Popover>
          <PopoverTrigger>
            <Tooltip>
              <TooltipTrigger asChild>
                <MoreHorizontalIcon className="size-4 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Links</p>
              </TooltipContent>
            </Tooltip>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="border-none flex flex-col items-center gap-2 w-auto bg-neutral-100 dark:bg-neutral-900 shadow-xl"
          >
            <Link
              href={project.githubLink || ""}
              target="_blank"
              className={`text-xs py-1 px-5 rounded-md cursor-pointer min-w-32 text-center border bg-background/20 ${
                !project.githubLink &&
                "text-muted-foreground line-through pointer-events-none opacity-50"
              }`}
            >
              Github
            </Link>
            <Link
              href={project.liveLink || ""}
              target="_blank"
              className={`text-xs py-1 px-5 rounded-md cursor-pointer min-w-32 text-center bg-primary text-primary-foreground ${
                !project.liveLink &&
                "text-muted-foreground line-through pointer-events-none opacity-50"
              }`}
            >
              Live
            </Link>
          </PopoverContent>
        </Popover>
      </div>

      {/* 4. Description */}
      <div className="flex flex-col gap-1 px-2">
        <div
          className={`whitespace-pre-wrap text-xs w-[95%] transition-all ${
            isExpanded ? "" : "line-clamp-5"
          }`}
        >
          {project.description || "No description provided"}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 w-fit cursor-pointer mt-1"
        >
          {isExpanded ? "less" : "more"}
          <ChevronDownIcon
            className={`size-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* 5. Main Project Image (Optimized Sizes) */}
      <div className="w-full px-1">
        <Image
          src={project.image || "/empty-img.webp"}
          alt="project-img"
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, 640px"
          className="w-full h-auto object-cover rounded-md border border-border/50"
          priority={false}
        />
      </div>

      {/* 6. Stats Section */}
      <div className="flex items-center justify-between w-full gap-2 px-2">
        <div className="flex items-center gap-1">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center p-[3px] ${isLiked ? "bg-primary" : "bg-blue-500"}`}
          >
            <ThumbsUpIcon className="size-3 text-white" />
          </div>
          <p className="text-xs text-muted-foreground">{likesCount}</p>
        </div>

        <p
          className="text-xs text-muted-foreground hover:underline cursor-pointer"
          onClick={() => setShowComments(!showComments)}
        >
          {project.commentsCount}{" "}
          {project.commentsCount === 1 ? "comment" : "comments"}
        </p>
      </div>

      <Separator />

      {/* 7. Action Buttons */}
      <div className="w-full flex items-center justify-between px-10 py-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleLikeClick}
              disabled={isLoading}
              className="group"
            >
              <ThumbsUpIcon
                className={`size-5 transition-all group-hover:scale-110 ${
                  isLiked
                    ? "text-primary fill-primary"
                    : "text-muted-foreground"
                } ${isLoading ? "opacity-50" : ""}`}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isLiked ? "Unlike" : "Like"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <MessageSquareMoreIcon
              onClick={() => setShowComments(!showComments)}
              className={`size-5 cursor-pointer transition-colors ${showComments ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Comment</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => handleShare(project)}
              className="outline-none"
            >
              <SendIcon className="size-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/projects/${project.id}`} className="outline-none">
              <EyeIcon className="size-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Details</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {showComments && <CreateComment projectId={project.id} />}
    </div>
  );
};

export default ProjectCard;
