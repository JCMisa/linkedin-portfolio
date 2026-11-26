import { Skeleton } from "@/components/ui/skeleton";

export const CertificatePreviewSkeleton = () => (
  <div className="flex w-full items-start gap-2 overflow-hidden p-2">
    <Skeleton className="!dark:bg-neutral-900 h-14 w-14 shrink-0 rounded-full !bg-neutral-100" />

    <div className="flex w-full flex-col items-start">
      <Skeleton className="!dark:bg-neutral-900 h-5 w-3/5 rounded !bg-neutral-100" />
      <Skeleton className="!dark:bg-neutral-900 mt-1 h-3 w-2/5 rounded !bg-neutral-100" />
      <Skeleton className="!dark:bg-neutral-900 mt-2 h-7 w-20 rounded-full !bg-neutral-100" />
    </div>
  </div>
);
