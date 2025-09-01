"use client";

import { useEffect, useState } from "react";
import ProjectSearchAndCategorize from "@/app/_components/_feed/ProjectSearchAndCategorize";
import ProjectCard from "./ProjectCard";
import { getFilteredProjects } from "@/lib/actions/projects";
import { toast } from "sonner";
import Loader from "@/components/custom/Loader";
import { useDebounce } from "@/utils/useDebounce";

export default function ProjectsList({
  currentUser,
}: {
  currentUser: UserType;
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
            <p className="text-center text-sm text-gray-500 font-semibold">
              No projects found
            </p>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
