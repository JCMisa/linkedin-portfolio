import { Skeleton } from "@/components/ui/skeleton";

export const CertificatePreviewSkeleton = () => (
  <div className="flex w-full items-start gap-2 overflow-hidden p-2">
    <Skeleton className="size-14 shrink-0 rounded-full" />

    <div className="flex w-full flex-col items-start">
      <Skeleton className="h-5 w-3/5 rounded" />
      <Skeleton className="mt-1 h-3 w-2/5 rounded" />
      <Skeleton className="mt-2 h-7 w-20 rounded-full" />
    </div>
  </div>
);
