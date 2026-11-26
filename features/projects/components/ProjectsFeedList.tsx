import Loader from "@/components/shared/Loader";
import ProjectPostCard from "./ProjectPostCard";
import ProjectCardSkeleton from "./ProjectCardSkeleton";
import { Button } from "@/components/ui/button";
import { PersonalInfoType } from "@/db/schema";
import { OptimizedProject } from "@/features/projects/types";

const ProjectsFeedList = ({
  projects,
  isFetchingProjects,
  userRole,
  hasMore,
  loadMore,
  personalInfo,
}: {
  projects: OptimizedProject[];
  isFetchingProjects: boolean;
  userRole: string;
  hasMore: boolean;
  loadMore: () => void;
  personalInfo: PersonalInfoType;
}) => {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      {projects && projects.length > 0 ? (
        <>
          {projects.map((project) => (
            <ProjectPostCard
              key={project.id}
              project={project}
              userRole={userRole}
              personalInfo={personalInfo}
            />
          ))}
          {isFetchingProjects && <Loader />}
          {!isFetchingProjects && hasMore && (
            <Button
              onClick={loadMore}
              variant="outline"
              className="mx-auto w-max"
            >
              Load more
            </Button>
          )}
        </>
      ) : (
        /* If no projects exist AND we aren't fetching, 
           we only show skeletons during initial load. */
        <div className="flex w-full flex-col items-center gap-2">
          {isFetchingProjects &&
            [1, 2, 3].map((id) => <ProjectCardSkeleton key={id} />)}
          {!isFetchingProjects && (
            <p className="mt-4 text-sm text-muted-foreground">
              No projects found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsFeedList;
