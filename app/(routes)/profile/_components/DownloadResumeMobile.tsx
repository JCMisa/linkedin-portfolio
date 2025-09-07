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
      <PopoverContent className="flex flex-col gap-2" align="end">
        <span
          className="cursor-pointer text-sm"
          onClick={() => {
            const link = document.createElement("a");
            link.href = "/Resume-IT.pdf";
            link.download = "John_Carlo_Misa_Resume_IT.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          IT Resume
        </span>
        <span
          className="cursor-pointer text-sm"
          onClick={() => {
            const link = document.createElement("a");
            link.href = "/Resume-VA-General.pdf";
            link.download = "John_Carlo_Misa_Resume_VA.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          VA Resume
        </span>
      </PopoverContent>
    </Popover>
  );
};

export default DownloadResumeMobile;
