import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton, TextLinesSkeleton } from "@/components/shared/skeletons";
import { cn } from "@/lib/utils";

/** Mirrors ProfileAnalytics: three stats in a card. */
export function ProfileAnalyticsSkeleton() {
  return (
    <CardSkeleton className="grid grid-cols-3 gap-4 p-4 sm:p-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-10" />
        </div>
      ))}
    </CardSkeleton>
  );
}

/** Mirrors LatestProjects (hidden below sm, like the real card). */
export function LatestProjectsSkeleton({ className }: { className?: string }) {
  return (
    <CardSkeleton className={cn("space-y-4 p-4 sm:p-6", className)}>
      <Skeleton className="h-5 w-36" />
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-video w-full" />
            <TextLinesSkeleton lines={2} />
          </div>
        ))}
      </div>
    </CardSkeleton>
  );
}
