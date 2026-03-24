import Loader from "@/components/custom/Loader";
import ProjectCard from "./ProjectCard";
import ProjectsSkeletonCard from "./ProjectsSkeletonCard";
import { Button } from "@/components/ui/button";
import { PersonalInfoType, ProjectsType } from "@/config/schema";

export interface OptimizedProject extends ProjectsType {
  likesCount: number;
  hasLiked: boolean;
  commentsCount: number;
  latestCommenter: { name: string; image: string } | null;
}

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
    <div className="flex flex-col items-center gap-2 w-full">
      {projects && projects.length > 0 ? (
        <>
          {projects.map((project) => (
            <ProjectCard
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
              className="w-max mx-auto"
            >
              Load more
            </Button>
          )}
        </>
      ) : (
        /* If no projects exist AND we aren't fetching, 
           we only show skeletons during initial load. */
        <div className="flex flex-col items-center gap-2 w-full">
          {isFetchingProjects &&
            [1, 2, 3].map((id) => <ProjectsSkeletonCard key={id} />)}
          {!isFetchingProjects && (
            <p className="text-sm text-muted-foreground mt-4">
              No projects found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsFeedList;
