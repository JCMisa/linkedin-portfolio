import Loader from "@/components/custom/Loader";
import ProjectCard from "./ProjectCard";
import ProjectsSkeletonCard from "./ProjectsSkeletonCard";
import { Button } from "@/components/ui/button";
import { getPersonalInfo } from "@/lib/actions/profileInfo";
import { PersonalInfoType } from "@/config/schema";

const ProjectsFeedList = ({
  projects,
  isFetchingProjects,
  userRole,
  hasMore,
  loadMore,
  personalInfo,
}: {
  projects: ProjectType[];
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
        <div className="flex flex-col items-center gap-2 w-full">
          {[1, 2, 3].map((project) => (
            // skeleton effect
            <ProjectsSkeletonCard key={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsFeedList;
