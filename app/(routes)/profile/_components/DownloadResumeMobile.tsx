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
      <PopoverTrigger asChild className="flex md:hidden">
        <div className="rounded-full w-8 h-8 cursor-pointer flex md:hidden items-center justify-center p-2 bg-blue-400 shadow-lg fixed bottom-3 left-3">
          <DownloadIcon className="size-4 text-white" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2" align="end" side="top">
        <a
          href="https://drive.google.com/file/d/1twXzPjK3HCeqBigrkeCu47OpP2RYTSON/view?usp=drive_link"
          download={"John_Carlo_Misa_Resume_IT.pdf"}
          target="_blank"
          className="cursor-pointer text-sm"
        >
          IT Resume
        </a>
        <a
          href="https://drive.google.com/file/d/1kMA1kKR1O6FpwRNBtsK29ChQafxFEkHi/view?usp=drive_link"
          download={"John_Carlo_Misa_Resume_VA.pdf"}
          target="_blank"
          className="cursor-pointer text-sm"
        >
          VA Resume
        </a>
      </PopoverContent>
    </Popover>
  );
};

export default DownloadResumeMobile;
