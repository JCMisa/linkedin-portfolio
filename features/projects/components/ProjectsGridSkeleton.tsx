import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton, TextLinesSkeleton } from "@/components/shared/skeletons";

const CHIP_WIDTHS = ["w-20", "w-24", "w-28", "w-20"];

/** /projects main column: search, category chips and the card grid. */
export default function ProjectsGridSkeleton() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <Skeleton className="h-10 w-full rounded-full" />
      <div className="flex gap-2 overflow-hidden">
        {CHIP_WIDTHS.map((w, i) => (
          <Skeleton key={i} className={`h-8 shrink-0 rounded-full ${w}`} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <CardSkeleton key={i} className="space-y-4 p-6">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-4 w-3/4" />
            <TextLinesSkeleton lines={2} />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </CardSkeleton>
        ))}
      </div>
    </div>
  );
}
