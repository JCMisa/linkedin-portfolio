import React from "react";
import ProjectGridCard from "@/features/projects/components/ProjectGridCard";

const LatestProjects = ({
  latestProject1,
  latestProject2,
}: {
  latestProject1: ProjectType;
  latestProject2: ProjectType;
}) => {
  return (
    <div className="hidden w-full flex-col rounded-lg border bg-card p-[10px] px-5 sm:flex">
      <h2 className="text-xl font-semibold">Latest Projects</h2>
      <div className="no-scrollbar mt-5 grid w-full grid-cols-1 items-center gap-2 overflow-auto lg:grid-cols-2">
        <ProjectGridCard project={latestProject1} />
        <ProjectGridCard project={latestProject2} />
      </div>
    </div>
  );
};

export default LatestProjects;
