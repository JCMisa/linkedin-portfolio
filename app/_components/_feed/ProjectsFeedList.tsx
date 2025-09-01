import Loader from "@/components/custom/Loader";
import ProjectCard from "./ProjectCard";
import ProjectsSkeletonCard from "./ProjectsSkeletonCard";

const ProjectsFeedList = ({
  projects,
  isFetchingProjects,
  userRole,
}: {
  projects: ProjectType[];
  isFetchingProjects: boolean;
  userRole: string;
}) => {
  return !isFetchingProjects ? (
    <div className="flex flex-col items-center gap-2 w-full">
      {projects && projects.length > 0 ? (
        projects.map((project) => (
          <ProjectCard key={project.id} project={project} userRole={userRole} />
        ))
      ) : (
        <div className="flex flex-col items-center gap-2 w-full">
          {[1, 2, 3].map((project) => (
            // skeleton effect
            <ProjectsSkeletonCard key={project} />
          ))}
        </div>
      )}
    </div>
  ) : (
    <Loader />
  );
};

export default ProjectsFeedList;
