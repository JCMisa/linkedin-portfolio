import { Skeleton } from "@/components/ui/skeleton";

export const CertificateCardSkeleton = () => (
  <div className="flex w-full flex-col space-y-6 rounded-lg bg-muted p-3">
    {/* header (buttons) */}
    <div className="flex w-full items-center justify-between gap-4">
      {/* View button */}
      <Skeleton className="h-7 w-[86px] rounded-full bg-card" />
      {/* Edit + Delete icons */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full bg-card" />
        <Skeleton className="h-6 w-6 rounded-full bg-card" />
      </div>
    </div>

    {/* image */}
    <Skeleton className="h-60 w-full rounded-lg bg-card" />

    {/* info */}
    <div className="flex flex-col items-start gap-2">
      <div className="flex w-full items-center justify-between gap-2">
        <Skeleton className="h-6 flex-1 rounded bg-card" />
        <Skeleton className="h-4 w-28 rounded bg-card" />
      </div>
      <Skeleton className="h-4 w-full rounded bg-card" />
    </div>
  </div>
);
