"use client";

import { Separator } from "@/components/ui/separator";
import ProjectSearchAndCategorize from "./ProjectSearchAndCategorize";
import ProjectsFeedList from "./ProjectsFeedList";
import CreateProject from "@/components/custom/CreateProject";
import { useEffect, useState } from "react";
import { useDebounce } from "@/utils/useDebounce";
import { getProjectsPaginated } from "@/lib/actions/projects";

export default function ProjectsFeed({
  userRole,
  initialProjects,
  initialCursor,
  initialHasMore,
}: {
  userRole: string;
  initialProjects: ProjectType[];
  initialCursor?: string;
  initialHasMore: boolean;
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  // reset + fetch first page on filter change
  useEffect(() => {
    setLoading(true);
    getProjectsPaginated({ query: debouncedSearch, category, limit: 5 }).then(
      ({ data, nextCursor }) => {
        setProjects(data ?? []);
        setCursor(nextCursor ?? undefined);
        setHasMore(!!nextCursor);
        setLoading(false);
      }
    );
  }, [debouncedSearch, category]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    setLoading(true);
    getProjectsPaginated({
      query: debouncedSearch,
      category,
      cursor,
      limit: 5,
    }).then(({ data, nextCursor }) => {
      setProjects((prev) => [...prev, ...(data ?? [])]);
      setCursor(nextCursor ?? undefined);
      setHasMore(!!nextCursor);
      setLoading(false);
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <ProjectSearchAndCategorize
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      <div className="flex items-center gap-2 w-full">
        <Separator
          className={`${
            userRole === "admin" ? "!w-[93%] sm:!w-[95%]" : "w-full"
          }`}
        />
        {userRole === "admin" && <CreateProject />}
      </div>

      <ProjectsFeedList
        projects={projects}
        isFetchingProjects={loading}
        userRole={userRole}
        hasMore={hasMore}
        loadMore={loadMore}
      />
    </div>
  );
}
