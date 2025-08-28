import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const LatestWorkExperience = () => {
  return (
    <div className="h-[124px] w-full dark:bg-dark flex flex-col items-start gap-4 rounded-lg p-3">
      <h2 className="font-bold text-md">Latest Work Experience</h2>
      <div className="flex items-center w-full gap-2 justify-between px-4">
        <div className="flex items-center gap-2">
          <Image
            src={"/ptp.webp"}
            alt="ptp-logo"
            width={1000}
            height={1000}
            className="w-14 h-14 object-cover rounded-lg"
          />
          <div className="flex flex-col items-start justify-between gap-2">
            <div className="flex flex-col items-start">
              <p className="text-sm font-bold">Philadelphia Truck Parts</p>
              <span className="text-[9px] text-muted-foreground">
                July 2025 -{" "}
                {new Date().toLocaleString("default", { month: "long" })}{" "}
                {new Date().getFullYear()}
              </span>
            </div>
            <span className="text-xs text-muted-foreground uppercase">
              Frontend Developer
            </span>
          </div>
        </div>

        {/* see more icon */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={"/experiences"}>
              <ChevronRightIcon className="size-6 hover:opacity-[0.8] transition-opacity duration-200 ease-in-out" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="transition-all duration-200 ease-linear">
            <p className="text-xs">See More</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default LatestWorkExperience;
