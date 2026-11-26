"use client";

import { useEffect, useRef, useState } from "react";
import { Grid, type CellComponentProps } from "react-window";
import ProjectSearchFilter from "./ProjectSearchFilter";
import ProjectGridCard from "./ProjectGridCard";
import { useProjectSearch } from "../hooks";
import type { ProjectCategory } from "../schemas";
import { useDebounce } from "@/hooks/use-debounce";
import ProjectCardSkeleton from "./ProjectCardSkeleton";
import { PersonalInfoType, ProjectsType } from "@/db/schema";
import { cn } from "@/lib/utils";

const ROW_HEIGHT = 500; // Fixed height to keep Grid stable
const GAP = 20;
const SCROLLBAR_WIDTH = 10;

export default function ProjectsList({
  userRole,
  personalInfo,
}: {
  userRole: string;
  personalInfo: PersonalInfoType;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1000);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { data: projects = [], isFetching: loading } = useProjectSearch({
    q: debouncedSearch,
    category: category as ProjectCategory | null,
  });

  // Resize logic from your Trucks project
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const widthWithClearance = entries[0].contentRect.width - SCROLLBAR_WIDTH;
      setContainerWidth(widthWithClearance);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Responsive Breakpoints
  const columnCount = 1;
  // if (containerWidth >= 768) columnCount = 2;
  // if (containerWidth >= 1280) columnCount = 3;

  const rowCount = Math.ceil(projects.length / columnCount);
  const columnWidth = containerWidth / columnCount;

  return (
    <div className="flex h-[800px] w-full flex-col items-center gap-5">
      <div className="flex w-full flex-col gap-4 px-[10px]">
        <ProjectSearchFilter
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          personalInfo={personalInfo}
        />

        {/* Results Counter */}
        {!loading && projects.length > 0 && (
          <div className="flex animate-in items-center justify-between px-2 duration-500 fade-in slide-in-from-top-1">
            <p className="text-sm font-medium text-muted-foreground">
              Showing{" "}
              <span className="font-bold text-foreground">
                {projects.length.toLocaleString()}
              </span>{" "}
              {projects.length === 1 ? "project" : "projects"}
              {debouncedSearch && (
                <span>
                  {" "}
                  related to &ldquo;
                  <span className="text-primary italic">{debouncedSearch}</span>
                  &rdquo;
                </span>
              )}
            </p>

            {/* Optional: A small "Clear" indicator if they are filtering */}
            {(debouncedSearch || category) && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory(null);
                }}
                className="cursor-pointer text-[10px] font-bold tracking-wider text-primary uppercase hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        className="group relative min-h-0 w-full flex-1 overflow-hidden"
      >
        {loading ? (
          <div className="flex w-full flex-col gap-4">
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </div>
        ) : projects.length > 0 ? (
          <>
            <Grid
              cellComponent={CellComponent}
              cellProps={{ data: { projects, columnCount, userRole } }}
              columnCount={columnCount}
              // Use containerWidth directly to match the Search bar's parent
              columnWidth={columnWidth}
              rowCount={rowCount}
              rowHeight={ROW_HEIGHT + GAP}
              className="no-scrollbar" // 👈 Add the class here
              style={{
                width: "100%",
                height: "auto", // 👈 Change from fixed height to auto if you want it to expand
                overflowX: "hidden",
                overflowY: "auto", // 👈 This removes the scrollbar
                paddingRight: "0px",
                paddingLeft: "0px",
                // marginLeft: "-10px",
              }}
            />

            <div
              className={cn(
                "pointer-events-none absolute bottom-0 left-0 z-20 h-24 w-full",
                "bg-gradient-to-t from-background via-background/80 to-transparent",
                "dark:from-background dark:via-background/70 dark:to-transparent",
              )}
            />
          </>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center opacity-50">
            <p>No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Cell Component using your preferred pattern
const CellComponent = ({
  columnIndex,
  rowIndex,
  style,
  data,
}: CellComponentProps<{
  data: {
    projects: ProjectsType[];
    columnCount: number;
    userRole: string;
  };
}>) => {
  const { projects, columnCount, userRole } = data;

  const index = rowIndex * columnCount + columnIndex;
  const project = projects[index];

  if (!project) return null;

  // Safety check: ensure style values exist before doing math
  const left = typeof style.left === "number" ? style.left : 0;
  const top = typeof style.top === "number" ? style.top : 0;
  const width = typeof style.width === "number" ? style.width : 0;
  const height = typeof style.height === "number" ? style.height : 0;

  const adjustedStyle = {
    ...style,
    left: left + GAP / 2,
    top: top + GAP / 2,
    width: width - GAP,
    height: height - GAP,
  };

  return (
    <div style={adjustedStyle}>
      <ProjectGridCard project={project} currentUserRole={userRole} />
    </div>
  );
};
