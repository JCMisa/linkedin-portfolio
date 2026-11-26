import React from "react";

const ProjectCardSkeleton = () => {
  return (
    <div className="flex w-full animate-pulse flex-col items-start gap-3 overflow-hidden rounded-lg px-3 py-2 dark:bg-dark">
      {/* header skeleton */}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-[24px] w-[24px] rounded-full bg-muted" />
          <div className="h-2 w-32 rounded-md bg-muted" />
        </div>
        <div className="h-4 w-4 rounded-md bg-muted" />
      </div>

      <div className="h-[1px] w-full bg-muted" />

      {/* content header skeleton */}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex w-full items-center gap-2">
          <div className="h-[48px] w-[48px] rounded-full bg-muted" />
          <div className="flex w-[80%] flex-col gap-2">
            <div className="h-4 w-32 rounded-md bg-muted" />
            <div className="h-2 w-48 rounded-md bg-muted" />
            <div className="mt-1 h-2 w-24 rounded-md bg-muted" />
          </div>
        </div>
        <div className="h-4 w-4 rounded-md bg-muted" />
      </div>

      {/* content caption skeleton */}
      <div className="w-[90%] space-y-2">
        <div className="h-2 w-full rounded-md bg-muted" />
        <div className="h-2 w-full rounded-md bg-muted" />
        <div className="h-2 w-3/4 rounded-md bg-muted" />
        <div className="h-2 w-16 rounded-md bg-muted" />
      </div>

      {/* image skeleton */}
      <div className="h-[300px] w-full rounded-md bg-muted" />

      {/* stats skeleton */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-muted" />
          <div className="h-2 w-8 rounded-md bg-muted" />
        </div>
        <div className="h-2 w-16 rounded-md bg-muted" />
      </div>

      <div className="h-[1px] w-full bg-muted" />

      {/* actions skeleton */}
      <div className="flex w-full items-center justify-between px-10">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-5 w-5 rounded-md bg-muted" />
        ))}
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
