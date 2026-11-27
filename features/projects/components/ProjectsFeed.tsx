"use client";

import { useCurrentUser } from "@/features/users/hooks";

import { Separator } from "@/components/ui/separator";
import type { PersonalInfoType } from "@/db/schema";
import { useDebounce } from "@/hooks/use-debounce";
import { useProjectsFeed } from "../hooks";
import { useProjectFilters } from "../use-project-filters";
import type { OptimizedProject } from "../types";
import { ProjectFormDialog } from "./admin-dialogs";
import ProjectSearchFilter from "./ProjectSearchFilter";
import ProjectsFeedList from "./ProjectsFeedList";

export default function ProjectsFeed({
  initialPage,
  personalInfo,
}: {
  initialPage: { items: OptimizedProject[]; nextCursor: string | null };
  personalInfo: PersonalInfoType;
}) {
  const { isAdmin } = useCurrentUser();
  const { search, setSearch, category, setCategory } = useProjectFilters();
  const debouncedSearch = useDebounce(search, 300);

  const feed = useProjectsFeed({ q: debouncedSearch, category }, initialPage);
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
        <Separator className={isAdmin ? "!w-[93%] sm:!w-[95%]" : "w-full"} />
        {isAdmin && <ProjectFormDialog />}
      </div>

      <ProjectsFeedList
        projects={projects}
        isFetchingProjects={feed.isFetching}
        hasMore={!!feed.hasNextPage}
        loadMore={() => {
          if (!feed.isFetchingNextPage) feed.fetchNextPage();
        }}
        personalInfo={personalInfo}
      />
    </div>
  );
}
