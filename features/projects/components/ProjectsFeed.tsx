"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import type { PersonalInfoType } from "@/db/schema";
import { useDebounce } from "@/hooks/use-debounce";
import { useProjectsFeed } from "../hooks";
import type { ProjectCategory } from "../schemas";
import type { OptimizedProject } from "../types";
import CreateProject from "./CreateProject";
import ProjectSearchFilter from "./ProjectSearchFilter";
import ProjectsFeedList from "./ProjectsFeedList";

export default function ProjectsFeed({
  userRole,
  initialPage,
  personalInfo,
}: {
  userRole: string;
  initialPage: { items: OptimizedProject[]; nextCursor: string | null };
  personalInfo: PersonalInfoType;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const feed = useProjectsFeed(
    { q: debouncedSearch, category: category as ProjectCategory | null },
    initialPage,
  );
  const projects = feed.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="flex flex-col items-center gap-4">
      <ProjectSearchFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        personalInfo={personalInfo}
      />

      <div className="flex w-full items-center gap-2">
        <Separator
          className={userRole === "admin" ? "!w-[93%] sm:!w-[95%]" : "w-full"}
        />
        {userRole === "admin" && <CreateProject />}
      </div>

      <ProjectsFeedList
        projects={projects}
        isFetchingProjects={feed.isFetching}
        userRole={userRole}
        hasMore={!!feed.hasNextPage}
        loadMore={() => {
          if (!feed.isFetchingNextPage) feed.fetchNextPage();
        }}
        personalInfo={personalInfo}
      />
    </div>
  );
}
