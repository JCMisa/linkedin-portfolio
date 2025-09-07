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
    <div className="rounded-lg w-full bg-neutral-100 dark:bg-dark hidden sm:flex flex-col p-[10px] px-5">
      <h2 className="text-2xl font-medium">Latest Projects</h2>
      <div className="mt-5 flex flex-col lg:flex-row items-start lg:items-center gap-2 w-full overflow-auto no-scrollbar">
        <ProjectCard project={latestProject1} currentUserRole={userRole} />
        <ProjectCard project={latestProject2} currentUserRole={userRole} />
      </div>
    </div>
  );
};

export default LatestProjects;
