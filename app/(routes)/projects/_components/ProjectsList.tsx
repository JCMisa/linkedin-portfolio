"use client";

import { useEffect, useState } from "react";
import ProjectSearchAndCategorize from "@/app/_components/_feed/ProjectSearchAndCategorize";
import ProjectCard from "./ProjectCard";
import { getFilteredProjects } from "@/lib/actions/projects";
import { toast } from "sonner";
import Loader from "@/components/custom/Loader";
import { useDebounce } from "@/utils/useDebounce";
import ProjectsSkeletonCard from "@/app/_components/_feed/ProjectsSkeletonCard";

import { PersonalInfoType } from "@/config/schema";

export default function ProjectsList({
  currentUser,
  personalInfo,
}: {
  currentUser: UserType;
  personalInfo: PersonalInfoType;
}) {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await getFilteredProjects({
          query: debouncedSearch,
          category,
        });
        setProjects(data ?? []);
      } catch (error) {
        console.log("Error fetching projects: ", error);
        toast.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    })();
  }, [debouncedSearch, category]);

  return (
    <div className="flex flex-col items-center gap-5 w-full lg:w-[75%]">
      <ProjectSearchAndCategorize
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        personalInfo={personalInfo}
      />

      {!loading ? (
        <div className="flex flex-col w-full gap-3">
          {projects.length > 0 ? (
            projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                currentUserRole={currentUser.role}
              />
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
      )}
    </div>
  );
}
