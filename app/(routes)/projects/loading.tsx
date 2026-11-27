import ProjectsGridSkeleton from "@/features/projects/components/ProjectsGridSkeleton";
import { PageSkeleton, SidebarSkeleton } from "@/components/shared/skeletons";

/** Projects: search + category chips, card grid, sidebar. */
export default function ProjectsLoading() {
  return (
    <PageSkeleton>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        <ProjectsGridSkeleton />
        <SidebarSkeleton />
      </div>
    </PageSkeleton>
  );
}
