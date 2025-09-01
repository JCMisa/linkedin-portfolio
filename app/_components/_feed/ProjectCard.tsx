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
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getProjectLikes,
  hasUserLikedProject,
  toggleProjectLike,
} from "@/lib/actions/likes";
import { getProjectComments } from "@/lib/actions/comments";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateComment from "@/components/custom/CreateComment";
import { useUser } from "@clerk/nextjs";
import EditProject from "@/components/custom/EditProject";
import DeleteProject from "@/components/custom/DeleteProject";

const ProjectCard = ({
  project,
  userRole,
}: {
  project: ProjectType;
  userRole: string;
}) => {
  const { user } = useUser();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [latestCommenter, setLatestCommenter] =
    useState<CommentUserType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [likesResult, userLikeStatus, commentsResult] = await Promise.all([
        getProjectLikes(project.id),
        hasUserLikedProject(project.id),
        getProjectComments(project.id),
      ]);

      if (likesResult.success && likesResult.data) {
        setLikesCount(likesResult.data.length);
      }

      if (userLikeStatus.success) {
        setIsLiked(userLikeStatus.data);
      }

      if (commentsResult.success && commentsResult.data) {
        const comments = commentsResult.data;
        setCommentsCount(comments.length);

        // Set latest commenter if comments exist
        if (comments.length > 0) {
          const latestComment = comments[0];
          if (latestComment.user) {
            setLatestCommenter({
              id: latestComment.user.id,
              name: latestComment.user.name,
              image: latestComment.user.image,
              role: latestComment.user.role,
            });
          }
        }
      }
    };

    fetchData();
  }, [project.id, user]);

  const handleLikeClick = async () => {
    if (!user || isLoading) return;

    setIsLoading(true);
    // Optimistic update
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const result = await toggleProjectLike(project.id);
      if (!result.success) {
        // Revert optimistic update if failed
        setIsLiked((prev) => !prev);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert optimistic update if failed
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full dark:bg-dark flex flex-col items-start gap-3 rounded-lg py-2 px-3 overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-2 justify-between w-full">
        {/* latest commenter */}
        <div className="flex items-center gap-2">
          {latestCommenter ? (
            <>
              <Image
                src={latestCommenter?.image || "/empty-img.webp"}
                alt="commenter"
                width={1000}
                height={1000}
                className="w-[24px] h-[24px] object-fill rounded-full"
              />
              <p className="text-[9px]">
                {latestCommenter.name}{" "}
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
          {userRole && userRole === "admin" && (
            <>
              <EditProject project={project} />
              <DeleteProject project={project} />
            </>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/project/${project.id}`}>
                <ChevronRightIcon className="size-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>More Details</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Separator />

      {/* content header */}
      <div className="flex items-center justify-center w-full">
        <div className="flex items-center gap-2 w-full">
          <Image
            src={"/profile-img.jpg"}
            alt="profile-img"
            width={1000}
            height={1000}
            className="w-[48px] h-[48px] object-fill rounded-full"
          />
          <div className="flex flex-col w-[80%] ">
            <p className="text-sm font-bold capitalize truncate">
              {project.title}
            </p>
            <span className="text-xs text-muted-foreground truncate">
              {project.techStacks && project.techStacks.length > 0
                ? project.techStacks.join(" | ")
                : "No tech stacks"}
            </span>
            <span className="text-xs text-muted-foreground truncate flex items-center mt-1">
              {Math.ceil(
                (Date.now() - new Date(project.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24)
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
                <p>Github & Live Links</p>
              </TooltipContent>
            </Tooltip>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="border-none flex flex-col items-center gap-2 w-auto bg-neutral-100 dark:bg-neutral-900"
          >
            <Link
              href={project.githubLink ? project.githubLink : ""}
              target="_blank"
              className={`text-xs py-1 px-5 rounded-md cursor-pointer min-w-32 max-w-32 flex items-center justify-center border bg-background/20 ${
                !project.githubLink &&
                "text-muted-foreground line-through pointer-events-none opacity-[0.5]"
              }`}
            >
              Github
            </Link>
            <Link
              href={project.liveLink ? project.liveLink : ""}
              target="_blank"
              className={`text-xs py-1 px-5 rounded-md cursor-pointer min-w-32 max-w-32 flex items-center justify-center border-none bg-primary ${
                !project.liveLink &&
                "text-muted-foreground line-through pointer-events-none opacity-[0.5]"
              }`}
            >
              Live
            </Link>
          </PopoverContent>
        </Popover>
      </div>

      {/* content caption */}
      <div className="flex flex-col gap-1">
        <div className={`text-xs w-[90%] ${isExpanded ? "" : "line-clamp-5"}`}>
          {project.description || "No description provided"}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1 w-fit cursor-pointer"
        >
          {isExpanded ? (
            <>
              less
              <ChevronDownIcon className="size-3 rotate-180" />
            </>
          ) : (
            <>
              more
              <ChevronDownIcon className="size-3" />
            </>
          )}
        </button>
      </div>

      {/* content image */}
      <Image
        src={project.image || "/empty-img.webp"}
        alt="project-img"
        width={1000}
        height={1000}
        className="w-full h-full object-cover rounded-md"
      />

      {/* project stats */}
      <div className="flex items-center justify-between w-full gap-2">
        {/* likes */}
        <div className="flex items-center gap-1">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center p-[3px] ${
              isLiked ? "bg-primary" : "bg-blue-500"
            }`}
          >
            <ThumbsUpIcon className="size-3" />
          </div>
          <p className="text-xs text-muted-foreground">{likesCount}</p>
        </div>

        {/* comments */}
        <p className="text-xs text-muted-foreground">
          {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
        </p>
      </div>

      <Separator />

      {/* actions */}
      <div className="w-full flex items-center gap-2 justify-between px-10">
        <Tooltip>
          <TooltipTrigger>
            <ThumbsUpIcon
              onClick={handleLikeClick}
              className={`size-5 cursor-pointer hover:opacity-[0.8] transition-all duration-200 ease-in-out
                ${isLiked ? "text-primary fill-primary" : ""}
                ${isLoading ? "opacity-50" : ""}
              `}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{isLiked ? "Unlike" : "Like"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <MessageSquareMoreIcon
              onClick={() => setShowComments(!showComments)}
              className="size-5 cursor-pointer hover:opacity-[0.8] transition-opacity duration-200 ease-in-out"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Comment</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <SendIcon className="size-5 cursor-pointer hover:opacity-[0.8] transition-opacity duration-200 ease-in-out" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Share</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <EyeIcon className="size-5 cursor-pointer hover:opacity-[0.8] transition-opacity duration-200 ease-in-out" />
          </TooltipTrigger>
          <TooltipContent>
            <p>View Details</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Comments Section */}
      {showComments && <CreateComment projectId={project.id} />}
    </div>
  );
};

export default ProjectCard;
