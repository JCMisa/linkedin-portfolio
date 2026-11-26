import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { PersonalInfoType } from "@/db/schema";
import { format, parseISO, isValid } from "date-fns";

const LatestWorkExperience = ({
  personalInfo,
}: {
  personalInfo: PersonalInfoType;
}) => {
  const latestExp = personalInfo.experiences.find(
    (e) => !e.dateTo || e.dateTo === "",
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Present";
    try {
      const date = parseISO(dateStr);
      return isValid(date) ? format(date, "MMMM d, yyyy") : dateStr;
    } catch {
      return dateStr;
    }
  };

  if (!latestExp) return null;

  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-lg border border-transparent bg-neutral-100 p-4 shadow-sm transition-all duration-300 hover:border-neutral-200 dark:bg-dark dark:hover:border-neutral-800">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-sm font-bold tracking-tight text-neutral-800 dark:text-neutral-200">
          Latest Work Experience
        </h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={"/experiences"}>
              <div className="rounded-full p-1 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800">
                <ChevronRightIcon className="size-5 text-neutral-500" />
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">View all experiences</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="group flex w-full items-start gap-3">
        <div className="relative flex-shrink-0">
          <Image
            src={latestExp.bannerImg || "/empty-img.webp"}
            alt={latestExp.title}
            width={1000}
            height={1000}
            className="h-14 w-14 rounded-xl border border-neutral-200 object-cover shadow-sm dark:border-neutral-800"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <p className="mb-1 truncate text-sm leading-tight font-bold text-neutral-900 dark:text-neutral-100">
            {latestExp.title}
          </p>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
              {formatDate(latestExp.dateFrom)} — {formatDate(latestExp.dateTo)}
            </span>
            <p className="line-clamp-2 text-[11px] leading-normal text-neutral-600 dark:text-neutral-400">
              {latestExp.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestWorkExperience;
