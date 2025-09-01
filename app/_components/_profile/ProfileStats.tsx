import { LinkPreview } from "@/components/ui/link-preview";
import React from "react";

const ProfileStats = () => {
  return (
    <div className="h-[76px] w-full dark:bg-dark flex flex-col items-center justify-center rounded-lg p-5">
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold">Resume Link</p>
          <LinkPreview
            url="https://drive.google.com/file/d/1GMpTfF4YWTc60tBCEB0OfTCQynBbGqye/view?usp=sharing"
            className="text-xs font-semibold !text-blue-500"
          >
            Resume
          </LinkPreview>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs font-bold">Github Link</p>
          <LinkPreview
            url="https://github.com/JCMisa"
            className="text-xs font-semibold !text-blue-500"
          >
            JCMisa
          </LinkPreview>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
