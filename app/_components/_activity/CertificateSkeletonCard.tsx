import { Skeleton } from "@/components/ui/skeleton";

export const CertificateSkeletonCard = () => (
  <div className="flex items-start gap-2 overflow-hidden w-full p-2">
    <Skeleton className="w-14 h-14 rounded-full shrink-0 !bg-neutral-100 !dark:bg-neutral-900" />

    <div className="flex flex-col items-start w-full ">
      <Skeleton className="h-5 w-3/5 rounded !bg-neutral-100 !dark:bg-neutral-900" />
      <Skeleton className="h-3 w-2/5 rounded mt-1 !bg-neutral-100 !dark:bg-neutral-900" />
      <Skeleton className="h-7 w-20 rounded-full mt-2 !bg-neutral-100 !dark:bg-neutral-900" />
    </div>
  </div>
);
