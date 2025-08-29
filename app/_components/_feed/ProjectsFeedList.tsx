import ProjectCard from "./ProjectCard";

const ProjectsFeedList = () => {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {[1, 2, 3, 4, 5].map((project) => (
        <ProjectCard key={project} />
      ))}
    </div>
  );
};

export default ProjectsFeedList;
