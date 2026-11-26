import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton } from "@/components/shared/skeletons";

/** Placeholder sized like Clerk's sign-in / sign-up card. */
export function AuthCardSkeleton() {
  return (
    <CardSkeleton className="w-[min(400px,calc(100vw-2rem))] space-y-5 p-8">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
      </div>
      <Skeleton className="h-3 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <Skeleton className="h-9 w-full" />
      <Skeleton className="mx-auto h-3 w-48" />
    </CardSkeleton>
  );
}
