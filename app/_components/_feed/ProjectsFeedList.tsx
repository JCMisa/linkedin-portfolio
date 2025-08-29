import { getAllProjects } from "@/lib/actions/projects";
import ProjectCard from "./ProjectCard";
import ProjectsSkeletonCard from "./ProjectsSkeletonCard";

const ProjectsFeedList = async () => {
  const projects = await getAllProjects();

  if (projects && projects.data && projects.success) {
    return (
      <div className="flex flex-col items-center gap-2 w-full">
        {projects.data.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {[1, 2, 3].map((project) => (
        // skeleton effect
        <ProjectsSkeletonCard key={project} />
      ))}
    </div>
  );
};

export default ProjectsFeedList;
