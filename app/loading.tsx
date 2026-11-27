import ProjectCardSkeleton from "@/features/projects/components/ProjectCardSkeleton";
import {
  PageSkeleton,
  ProfileCardSkeleton,
  SidebarListSkeleton,
  SidebarSkeleton,
} from "@/components/shared/skeletons";

/** Feed: profile rail, posts, activity/certificates rail. */
export default function HomeLoading() {
  return (
    <PageSkeleton className="py-14 lg:py-18">
      <div className="relative mx-auto max-w-7xl">
        <div className="fixed hidden w-[240px] lg:block">
          <ProfileCardSkeleton />
        </div>

        <div className="flex flex-col gap-6 py-5 lg:flex-row lg:py-0 lg:pl-[265px]">
          <div className="flex w-full flex-col gap-2 lg:max-w-[640px]">
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </div>

          <SidebarSkeleton top={<SidebarListSkeleton rows={2} />} />
        </div>
      </div>
    </PageSkeleton>
  );
}
