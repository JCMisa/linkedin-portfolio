"use client";

import { Separator } from "@/components/ui/separator";
import {
  ChevronRightIcon,
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
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toggleProjectLike } from "@/features/projects/actions/likes";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateComment from "./CreateComment";
import { useUser } from "@clerk/nextjs";
import { DeleteProject, ProjectFormDialog } from "./admin-dialogs";
import { PersonalInfoType } from "@/db/schema";
import { shareProject } from "../lib/share";
import { OptimizedProject } from "@/features/projects/types";
import { cn } from "@/lib/utils";

/** LinkedIn-style action bar button: icon over label on mobile, side by side from sm. */
const actionClass =
  "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-md px-2 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50 sm:flex-row sm:gap-1.5 sm:text-sm";

/** "3d" style age, like LinkedIn posts. */
function postAge(createdAt: Date | string) {
  const days = Math.max(
    1,
    Math.ceil((Date.now() - new Date(createdAt).getTime()) / 86_400_000),
  );
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.floor(days / 7)}w`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  return `${Math.floor(days / 365)}y`;
}

const ProjectPostCard = ({
  project,
  userRole,
  personalInfo,
}: {
  project: OptimizedProject;
  userRole: string;
  personalInfo: PersonalInfoType;
}) => {
  const { user } = useUser();

  // Initialized from server props; reconciled after each like toggle
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(project.hasLiked);
  const [likesCount, setLikesCount] = useState(project.likesCount);
  const [isLoading, setIsLoading] = useState(false);

  const titleId = `project-${project.id}-title`;
  const commentsId = `project-${project.id}-comments`;

  const handleLikeClick = async () => {
    if (isLoading) return;
    if (!user) {
      toast.info("Sign in to like projects.");
      return;
    }

    setIsLoading(true);
    // Optimistic update
    const previousIsLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!previousIsLiked);
    setLikesCount((prev) => (previousIsLiked ? prev - 1 : prev + 1));

    try {
      const result = await toggleProjectLike({ projectId: project.id });
      if (result?.data) {
        // Reconcile with the server's authoritative state
        setIsLiked(result.data.liked);
        setLikesCount(result.data.likesCount);
      } else {
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

  const externalLinks = [
    { label: "GitHub", href: project.githubLink, primary: false },
    { label: "Live demo", href: project.liveLink, primary: true },
  ];

  return (
    <article
      aria-labelledby={titleId}
      className="flex w-full flex-col items-start gap-3 overflow-hidden rounded-lg border bg-card px-3 py-2"
    >
      {/* Header: latest commenter */}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {project.latestCommenter ? (
            <>
              <Image
                src={project.latestCommenter.image || "/empty-img.webp"}
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0 rounded-full object-cover"
              />
              <p className="truncate text-xs">
                <span className="font-semibold">
                  {project.latestCommenter.name}
                </span>{" "}
                <span className="text-muted-foreground">commented on this</span>
              </p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Be the first to comment
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {userRole === "admin" && (
            <>
              <ProjectFormDialog project={project} />
              <DeleteProject project={project} />
            </>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/projects"
                aria-label="More projects"
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ChevronRightIcon className="size-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>More projects</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Separator />

      {/* Author + title */}
      <div className="flex w-full items-start justify-between gap-2 px-2">
        <div className="flex min-w-0 items-start gap-2">
          <Image
            src={personalInfo.profileImg || "/empty-img.webp"}
            alt=""
            width={48}
            height={48}
            className="size-12 flex-none rounded-full object-cover"
          />
          <div className="flex min-w-0 flex-col">
            <h2
              id={titleId}
              className="line-clamp-2 text-sm font-semibold text-foreground capitalize"
            >
              <Link
                href={`/projects/${project.id}`}
                className="hover:text-primary hover:underline"
              >
                {project.title}
              </Link>
            </h2>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {project.techStacks && project.techStacks.length > 0
                ? project.techStacks.join(" · ")
                : "No tech stack listed"}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <time dateTime={new Date(project.createdAt).toISOString()}>
                {postAge(project.createdAt)}
              </time>
              <span aria-hidden>·</span>
              <EarthIcon className="size-3.5" />
              <span className="sr-only">Public</span>
            </p>
          </div>
        </div>

        <Popover>
          <PopoverTrigger
            aria-label={`Links for ${project.title}`}
            className="shrink-0 cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <MoreHorizontalIcon className="size-4" />
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="flex w-auto flex-col items-stretch gap-2 bg-card"
          >
            {externalLinks.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "min-w-32 rounded-full px-5 py-1 text-center text-xs font-semibold transition-colors",
                    link.primary
                      ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                      : "border border-input text-muted-foreground hover:bg-accent",
                  )}
                >
                  {link.label}
                </a>
              ) : (
                <span
                  key={link.label}
                  aria-disabled
                  className="min-w-32 rounded-full border border-dashed px-5 py-1 text-center text-xs text-muted-foreground"
                >
                  No {link.label.toLowerCase()} link
                </span>
              ),
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Description */}
      <div className="flex w-full flex-col gap-1 px-2">
        <p
          className={cn(
            "text-sm whitespace-pre-wrap",
            !isExpanded && "line-clamp-3",
          )}
        >
          {project.description || "No description provided."}
        </p>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="w-fit cursor-pointer rounded-sm text-xs font-semibold text-muted-foreground hover:text-primary hover:underline"
        >
          {isExpanded ? "Show less" : "…more"}
        </button>
      </div>

      {/* Project image */}
      <Link href={`/projects/${project.id}`} className="w-full" tabIndex={-1}>
        <Image
          src={project.image || "/empty-img.webp"}
          alt={`${project.title} preview`}
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, 640px"
          className="h-auto w-full rounded-md border object-cover"
        />
      </Link>

      {/* Stats */}
      <div className="flex w-full items-center justify-between gap-2 px-2">
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="flex size-4 items-center justify-center rounded-full bg-primary p-[3px]">
            <ThumbsUpIcon className="size-3 text-primary-foreground" />
          </span>
          {likesCount}
          <span className="sr-only">{likesCount === 1 ? "like" : "likes"}</span>
        </p>

        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          aria-expanded={showComments}
          aria-controls={commentsId}
          className="cursor-pointer rounded-sm text-xs text-muted-foreground hover:text-primary hover:underline"
        >
          {project.commentsCount}{" "}
          {project.commentsCount === 1 ? "comment" : "comments"}
        </button>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex w-full items-center gap-1 pb-1">
        <button
          type="button"
          onClick={handleLikeClick}
          disabled={isLoading}
          aria-pressed={isLiked}
          className={cn(actionClass, isLiked && "text-primary")}
        >
          <ThumbsUpIcon className={cn("size-5", isLiked && "fill-primary")} />
          Like
        </button>

        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          aria-expanded={showComments}
          aria-controls={commentsId}
          className={cn(actionClass, showComments && "text-primary")}
        >
          <MessageSquareMoreIcon className="size-5" />
          Comment
        </button>

        <button
          type="button"
          onClick={() => shareProject(project)}
          className={actionClass}
        >
          <SendIcon className="size-5" />
          Share
        </button>

        <Link href={`/projects/${project.id}`} className={actionClass}>
          <EyeIcon className="size-5" />
          View
        </Link>
      </div>

      {showComments && (
        <div id={commentsId} className="w-full">
          <CreateComment projectId={project.id} />
        </div>
      )}
    </article>
  );
};

export default ProjectPostCard;
