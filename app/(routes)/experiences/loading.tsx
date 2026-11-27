import { Skeleton } from "@/components/ui/skeleton";
import {
  CardSkeleton,
  PageSkeleton,
  ProfileCardSkeleton,
  SidebarListSkeleton,
  SidebarSkeleton,
  TextLinesSkeleton,
} from "@/components/shared/skeletons";

/** Experience timeline + sidebar. */
export default function ExperiencesLoading() {
  return (
    <PageSkeleton>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        <CardSkeleton className="h-fit">
          <div className="flex items-center gap-2 p-4 pb-0 sm:p-6 sm:pb-0">
            <Skeleton className="size-5" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-8 p-4 sm:p-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="size-12 shrink-0 rounded-md" />
                <div className="w-full space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-32" />
                  <TextLinesSkeleton lines={3} className="pt-2" />
                </div>
              </div>
            ))}
          </div>
        </CardSkeleton>

        <SidebarSkeleton
          top={
            <>
              <ProfileCardSkeleton />
              <SidebarListSkeleton rows={1} />
            </>
          }
        />
      </div>
    </PageSkeleton>
  );
}
