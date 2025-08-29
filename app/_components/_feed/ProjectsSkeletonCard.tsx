import React from "react";

const ProjectsSkeletonCard = () => {
  return (
    <div className="w-full dark:bg-dark flex flex-col items-start gap-3 rounded-lg py-2 px-3 overflow-hidden animate-pulse">
      {/* header skeleton */}
      <div className="flex items-center gap-2 justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="w-[24px] h-[24px] rounded-full bg-muted" />
          <div className="h-2 w-32 bg-muted rounded-md" />
        </div>
        <div className="w-4 h-4 rounded-md bg-muted" />
      </div>

      <div className="w-full h-[1px] bg-muted" />

      {/* content header skeleton */}
      <div className="flex items-center gap-2 justify-between w-full">
        <div className="flex items-center gap-2 w-full">
          <div className="w-[48px] h-[48px] rounded-full bg-muted" />
          <div className="flex flex-col gap-2 w-[80%]">
            <div className="h-4 w-32 bg-muted rounded-md" />
            <div className="h-2 w-48 bg-muted rounded-md" />
            <div className="h-2 w-24 bg-muted rounded-md mt-1" />
          </div>
        </div>
        <div className="w-4 h-4 rounded-md bg-muted" />
      </div>

      {/* content caption skeleton */}
      <div className="space-y-2 w-[90%]">
        <div className="h-2 w-full bg-muted rounded-md" />
        <div className="h-2 w-full bg-muted rounded-md" />
        <div className="h-2 w-3/4 bg-muted rounded-md" />
        <div className="h-2 w-16 bg-muted rounded-md" />
      </div>

      {/* image skeleton */}
      <div className="w-full h-[300px] bg-muted rounded-md" />

      {/* stats skeleton */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-muted" />
          <div className="h-2 w-8 bg-muted rounded-md" />
        </div>
        <div className="h-2 w-16 bg-muted rounded-md" />
      </div>

      <div className="w-full h-[1px] bg-muted" />

      {/* actions skeleton */}
      <div className="w-full flex items-center justify-between px-10">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="w-5 h-5 rounded-md bg-muted" />
        ))}
      </div>
    </div>
  );
};

export default ProjectsSkeletonCard;
