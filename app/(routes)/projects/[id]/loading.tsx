import { Skeleton } from "@/components/ui/skeleton";
import {
  CardSkeleton,
  PageSkeleton,
  TextLinesSkeleton,
} from "@/components/shared/skeletons";

/** Project details: cover + description, comments, details and reactions. */
export default function ProjectLoading() {
  return (
    <PageSkeleton className="px-4 py-13 md:px-10 lg:px-16 lg:py-17">
      <div className="mx-auto max-w-6xl">
        <Skeleton className="mb-6 h-4 w-28" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <CardSkeleton>
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="space-y-4 p-6">
                <Skeleton className="h-7 w-2/3" />
                <Skeleton className="h-3 w-40" />
                <TextLinesSkeleton lines={4} />
              </div>
            </CardSkeleton>

            <CardSkeleton className="space-y-4 p-6">
              <Skeleton className="h-5 w-32" />
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="size-10 shrink-0 rounded-full" />
                  <TextLinesSkeleton lines={2} />
                </div>
              ))}
            </CardSkeleton>
          </div>

          <div className="flex flex-col gap-6">
            <CardSkeleton className="space-y-4 p-6">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-9 w-full rounded-full" />
              <Skeleton className="h-9 w-full rounded-full" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
              </div>
            </CardSkeleton>
            <CardSkeleton className="space-y-3 p-6">
              <Skeleton className="h-5 w-24" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-8 shrink-0 rounded-full" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </CardSkeleton>
          </div>
        </div>
      </div>
    </PageSkeleton>
  );
}
