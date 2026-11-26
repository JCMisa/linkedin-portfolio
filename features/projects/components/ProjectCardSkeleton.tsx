const ProjectCardSkeleton = () => {
  return (
    <div className="flex w-full flex-col items-start gap-3 overflow-hidden rounded-lg border bg-card px-3 py-2">
      {/* header skeleton */}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-[24px] w-[24px] animate-pulse rounded-full bg-accent" />
          <div className="h-2 w-32 animate-pulse rounded-md bg-accent" />
        </div>
        <div className="h-4 w-4 animate-pulse rounded-md bg-accent" />
      </div>

      <div className="h-[1px] w-full animate-pulse bg-accent" />

      {/* content header skeleton */}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex w-full items-center gap-2">
          <div className="h-[48px] w-[48px] animate-pulse rounded-full bg-accent" />
          <div className="flex w-[80%] flex-col gap-2">
            <div className="h-4 w-32 animate-pulse rounded-md bg-accent" />
            <div className="h-2 w-48 animate-pulse rounded-md bg-accent" />
            <div className="mt-1 h-2 w-24 animate-pulse rounded-md bg-accent" />
          </div>
        </div>
        <div className="h-4 w-4 animate-pulse rounded-md bg-accent" />
      </div>

      {/* content caption skeleton */}
      <div className="w-[90%] space-y-2">
        <div className="h-2 w-full animate-pulse rounded-md bg-accent" />
        <div className="h-2 w-full animate-pulse rounded-md bg-accent" />
        <div className="h-2 w-3/4 animate-pulse rounded-md bg-accent" />
        <div className="h-2 w-16 animate-pulse rounded-md bg-accent" />
      </div>

      {/* image skeleton */}
      <div className="h-[300px] w-full animate-pulse rounded-md bg-accent" />

      {/* stats skeleton */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded-full bg-accent" />
          <div className="h-2 w-8 animate-pulse rounded-md bg-accent" />
        </div>
        <div className="h-2 w-16 animate-pulse rounded-md bg-accent" />
      </div>

      <div className="h-[1px] w-full animate-pulse bg-accent" />

      {/* actions skeleton */}
      <div className="flex w-full items-center justify-between px-10">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-5 w-5 animate-pulse rounded-md bg-accent"
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
