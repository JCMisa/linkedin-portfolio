import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { PersonalInfoType } from "@/config/schema";
import { format, parseISO, isValid } from "date-fns";

const LatestWorkExperience = ({
  personalInfo,
}: {
  personalInfo: PersonalInfoType;
}) => {
  const latestExp = personalInfo.experiences[0];

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
    <div className="w-full bg-neutral-100 dark:bg-dark flex flex-col items-start gap-4 rounded-lg p-4 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 transition-all duration-300 shadow-sm">
      <div className="flex items-center justify-between w-full">
        <h2 className="font-bold text-sm tracking-tight text-neutral-800 dark:text-neutral-200">
          Latest Work Experience
        </h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={"/experiences"}>
              <div className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
                <ChevronRightIcon className="size-5 text-neutral-500" />
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">View all experiences</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-start gap-3 w-full group">
        <div className="relative flex-shrink-0">
          <Image
            src={latestExp.bannerImg || "/empty-img.webp"}
            alt={latestExp.title}
            width={1000}
            height={1000}
            className="w-14 h-14 object-cover rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800"
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate leading-tight mb-1">
            {latestExp.title}
          </p>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
              {formatDate(latestExp.dateFrom)} — {formatDate(latestExp.dateTo)}
            </span>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-normal">
              {latestExp.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestWorkExperience;
