import { Skeleton } from "@/components/ui/skeleton";

export const CertificateCardSkeleton = () => (
  <div className="flex w-full flex-col space-y-6 rounded-lg bg-neutral-200 dark:bg-dark/80 p-3">
    {/* header (buttons) */}
    <div className="w-full flex items-center justify-between gap-4">
      {/* View button */}
      <Skeleton className="bg-neutral-100 dark:bg-neutral-900 h-7 w-[86px] rounded-full" />
      {/* Edit + Delete icons */}
      <div className="flex items-center gap-2">
        <Skeleton className="bg-neutral-100 dark:bg-neutral-900 h-6 w-6 rounded-full" />
        <Skeleton className="bg-neutral-100 dark:bg-neutral-900 h-6 w-6 rounded-full" />
      </div>
    </div>

    {/* image */}
    <Skeleton className="bg-neutral-100 dark:bg-neutral-900 w-full h-60 rounded-lg" />

    {/* info */}
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center justify-between gap-2 w-full">
        <Skeleton className="bg-neutral-100 dark:bg-neutral-900 h-6 flex-1 rounded" />
        <Skeleton className="bg-neutral-100 dark:bg-neutral-900 h-4 w-28 rounded" />
      </div>
      <Skeleton className="bg-neutral-100 dark:bg-neutral-900 h-4 w-full rounded" />
    </div>
  </div>
);
