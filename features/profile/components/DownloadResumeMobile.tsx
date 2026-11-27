"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DownloadIcon } from "lucide-react";

const DownloadResumeMobile = () => {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Download resume"
        className="fixed bottom-3 left-3 flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary shadow-lg md:hidden"
      >
        <DownloadIcon className="size-4 text-primary-foreground" />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2" align="end" side="top">
        <a
          href="https://drive.google.com/file/d/1xYahrMC5zf9qmsRX7_zzENlS31eMue29/view?usp=drive_link"
          download={"John_Carlo_Misa_Resume_IT.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm text-sm hover:text-primary hover:underline"
        >
          IT Resume
        </a>
        <a
          href="https://drive.google.com/file/d/1kMA1kKR1O6FpwRNBtsK29ChQafxFEkHi/view?usp=drive_link"
          download={"John_Carlo_Misa_Resume_VA.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm text-sm hover:text-primary hover:underline"
        >
          VA Resume
        </a>
      </PopoverContent>
    </Popover>
  );
};

export default DownloadResumeMobile;
