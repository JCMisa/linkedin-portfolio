import { Skeleton } from "@/components/ui/skeleton";
import {
  CardSkeleton,
  PageSkeleton,
  SectionCardSkeleton,
  SidebarSkeleton,
} from "@/components/shared/skeletons";
import {
  LatestProjectsSkeleton,
  ProfileAnalyticsSkeleton,
} from "@/features/profile/components/ProfileSkeletons";

/** Profile: big intro card, stats/about/services sections, sidebar. */
export default function ProfileLoading() {
  return (
    <PageSkeleton>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 xl:flex-row">
        <div className="flex w-full min-w-0 flex-col gap-2 py-5 lg:py-0">
          {/* intro card: cover, overlapping avatar, name and headline */}
          <CardSkeleton className="lg:h-[400px]">
            <Skeleton className="h-32 w-full rounded-none sm:h-[140px]" />
            <div className="px-5 pb-6">
              <Skeleton className="-mt-[50px] size-[100px] rounded-full border-4 border-card sm:-mt-[76px] sm:size-[152px]" />
              <div className="mt-4 space-y-3">
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-full max-w-md" />
                <Skeleton className="h-3 w-48" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 w-28 rounded-full" />
                  <Skeleton className="h-8 w-28 rounded-full" />
                </div>
              </div>
            </div>
          </CardSkeleton>

          <ProfileAnalyticsSkeleton />

          <SectionCardSkeleton lines={4} />
          <SectionCardSkeleton lines={2} />

          <LatestProjectsSkeleton className="hidden sm:block" />
        </div>

        <SidebarSkeleton
          className="lg:w-full xl:w-[320px]"
          top={
            // profile language + public URL card
            <CardSkeleton>
              <Skeleton className="h-20 w-full rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </CardSkeleton>
          }
        />
      </div>
    </PageSkeleton>
  );
}
