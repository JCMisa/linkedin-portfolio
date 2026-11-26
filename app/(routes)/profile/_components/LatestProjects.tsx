import React from "react";
import ProjectCard from "../../projects/_components/ProjectCard";

const LatestProjects = ({
  latestProject1,
  latestProject2,
  userRole,
}: {
  latestProject1: ProjectType;
  latestProject2: ProjectType;
  userRole: string;
}) => {
  return (
    <div className="hidden w-full flex-col rounded-lg bg-neutral-100 p-[10px] px-5 sm:flex dark:bg-dark">
      <h2 className="text-2xl font-medium">Latest Projects</h2>
      <div className="no-scrollbar mt-5 grid w-full grid-cols-1 items-center gap-2 overflow-auto lg:grid-cols-2">
        <ProjectCard project={latestProject1} currentUserRole={userRole} />
        <ProjectCard project={latestProject2} currentUserRole={userRole} />
      </div>
    </div>
  );
};

export default LatestProjects;
