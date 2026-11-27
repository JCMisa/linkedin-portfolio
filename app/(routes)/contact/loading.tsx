import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton, PageSkeleton } from "@/components/shared/skeletons";

/** Map + contact cards on the left, message form on the right. */
export default function ContactLoading() {
  return (
    <PageSkeleton className="min-h-screen bg-muted p-0 pt-16 md:p-0 md:pt-16 lg:p-0 lg:pt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="space-y-6 lg:w-2/3">
            <Skeleton className="h-[400px] w-full rounded-lg lg:h-[500px]" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <CardSkeleton key={i} className="space-y-3 p-6">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-36" />
                </CardSkeleton>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:w-1/3">
            <CardSkeleton className="space-y-5 p-6 sm:p-8">
              <Skeleton className="h-6 w-40" />
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <Skeleton className="h-[150px] w-full" />
              <Skeleton className="h-10 w-full rounded-full" />
            </CardSkeleton>
            <Skeleton className="h-10 w-full rounded-full" />
          </div>
        </div>
      </div>
    </PageSkeleton>
  );
}
