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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProjectCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full dark:bg-dark flex flex-col items-start gap-3 rounded-lg py-2 px-3 overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-2 justify-between w-full">
        {/* latest commenter */}
        <div className="flex items-center gap-2">
          <Image
            src={"/empty-img.webp"}
            alt="cover-img"
            width={1000}
            height={1000}
            className="w-[24px] h-[24px] object-fill rounded-full"
          />
          <p className="text-[9px]">
            John Doe{" "}
            <span className="text-muted-foreground">commentd on this</span>
          </p>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={"/projects/1"}>
              <ChevronRightIcon className="size-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>More Details</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Separator />

      {/* content header */}
      <div className="flex items-center gap-2 justify-between w-full">
        <div className="flex items-center gap-2 w-full">
          <Image
            src={"/profile-img.jpg"}
            alt="cover-img"
            width={1000}
            height={1000}
            className="w-[48px] h-[48px] object-fill rounded-full"
          />
          <div className="flex flex-col w-[80%]">
            <p className="text-sm font-bold">Project Name</p>
            <span className="text-xs text-muted-foreground truncate">
              NextJS | TailwindCSS | Drizzle ORM | PostgreSQL PostgreSQL
            </span>
            <span className="text-xs text-muted-foreground truncate flex items-center mt-1">
              1d <DotIcon className="size-4" /> <EarthIcon className="size-4" />
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
            className="border-none flex flex-col items-center gap-2 w-auto"
          >
            <Link
              href={"/github-link"}
              className="text-xs py-1 px-5 rounded-md cursor-pointer min-w-32 max-w-32 flex items-center justify-center border bg-transparent"
            >
              Github
            </Link>
            <Link
              href={"/live-link"}
              className="text-xs py-1 px-5 rounded-md cursor-pointer min-w-32 max-w-32 flex items-center justify-center border-none bg-primary"
            >
              Live
            </Link>
          </PopoverContent>
        </Popover>
      </div>

      {/* content caption */}
      <div className="flex flex-col gap-1">
        <div className={`text-xs w-[90%] ${isExpanded ? "" : "line-clamp-5"}`}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur
          animi quia sint similique minima temporibus nobis earum recusandae
          molestiae, maiores tempore, ipsam excepturi? Illum aspernatur quia
          quo, reprehenderit nam id earum. Officiis quae placeat quo
          perferendis? Minima, nobis! Corporis velit facilis quasi, quaerat
          nobis et fugit laborum corrupti! Eveniet impedit blanditiis veniam,
          sapiente fugiat dolorum alias praesentium fuga pariatur accusantium
          tempore laudantium dolorem quas voluptate itaque quisquam voluptas hic
          earum iusto laborum doloribus quod. A laborum quaerat expedita alias
          animi odit architecto iusto voluptas dolorem aspernatur, eius saepe
          repudiandae exercitationem illum quas perferendis dolor accusantium
          error quidem. Rem, libero ad!
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
        src={"https://i.ibb.co/QFFnGnvg/vectra-img.png"}
        alt="project-img"
        width={1000}
        height={1000}
        className="w-full h-full object-cover rounded-md"
      />

      {/* project stats */}
      <div className="flex items-center justify-between w-full gap-2">
        {/* likes */}
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center p-[3px]">
            <ThumbsUpIcon className="size-3" />
          </div>
          <p className="text-xs text-muted-foreground">100</p>
        </div>

        {/* comments */}
        <p className="text-xs text-muted-foreground">5 comments</p>
      </div>

      <Separator />

      {/* actions */}
      <div className="w-full flex items-center gap-2 justify-between px-10">
        <Tooltip>
          <TooltipTrigger>
            <ThumbsUpIcon className="size-5 cursor-pointer hover:opacity-[0.8] transition-opacity duration-200 ease-in-out" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Like</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <MessageSquareMoreIcon className="size-5 cursor-pointer hover:opacity-[0.8] transition-opacity duration-200 ease-in-out" />
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
    </div>
  );
};

export default ProjectCard;
