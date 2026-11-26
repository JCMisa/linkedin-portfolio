import Loader from "@/components/shared/Loader";
import ProjectPostCard from "./ProjectPostCard";
import ProjectCardSkeleton from "./ProjectCardSkeleton";
import { Button } from "@/components/ui/button";
import { PersonalInfoType } from "@/db/schema";
import { OptimizedProject } from "@/features/projects/types";
import { EmptyState } from "@/components/shared/EmptyState";
import { FolderOpenIcon } from "lucide-react";

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
        /* Skeletons during the first load; an empty state once we know there are none */
        <div className="flex w-full flex-col items-center gap-2">
          {isFetchingProjects ? (
            [1, 2, 3].map((id) => <ProjectCardSkeleton key={id} />)
          ) : (
            <EmptyState
              icon={FolderOpenIcon}
              title="No projects yet"
              description="New projects will show up here once they're posted."
              className="rounded-lg border bg-card"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsFeedList;
