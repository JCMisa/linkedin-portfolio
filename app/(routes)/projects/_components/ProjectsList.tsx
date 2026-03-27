"use client";

import { useEffect, useRef, useState } from "react";
import { Grid, type CellComponentProps } from "react-window";
import ProjectSearchAndCategorize from "@/app/_components/_feed/ProjectSearchAndCategorize";
import ProjectCard from "./ProjectCard";
import { getFilteredProjects } from "@/lib/actions/projects";
import { toast } from "sonner";
import { useDebounce } from "@/utils/useDebounce";
import ProjectsSkeletonCard from "@/app/_components/_feed/ProjectsSkeletonCard";
import { PersonalInfoType, ProjectsType } from "@/config/schema";
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
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

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

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await getFilteredProjects({
          query: debouncedSearch,
          category,
        });
        if (res.success) setProjects(res.data || []);
      } catch (error) {
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [debouncedSearch, category]);

  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await getFilteredProjects({
  //         query: debouncedSearch,
  //         category,
  //       });

  //       if (res.success && res.data) {
  //         // --- SIMULATION LOGIC START ---
  //         // If you have 5 projects, this makes 5000 projects (1000 copies)
  //         const simulatedProjects = Array.from({ length: 1000 }).flatMap(() =>
  //           res.data.map((project: any) => ({
  //             ...project,
  //             id: crypto.randomUUID(), // Generate unique IDs to avoid key collisions
  //           })),
  //         );

  //         setProjects(simulatedProjects);
  //         // --- SIMULATION LOGIC END ---

  //         // Use this instead if you want real data only:
  //         // setProjects(res.data);
  //       }
  //     } catch (error) {
  //       toast.error("Failed to load projects");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProjects();
  // }, [debouncedSearch, category]);

  // Responsive Breakpoints
  let columnCount = 1;
  // if (containerWidth >= 768) columnCount = 2;
  // if (containerWidth >= 1280) columnCount = 3;

  const rowCount = Math.ceil(projects.length / columnCount);
  const columnWidth = containerWidth / columnCount;

  return (
    <div className="flex flex-col items-center gap-5 w-full h-[800px]">
      <div className="px-[10px] w-full flex flex-col gap-4">
        <ProjectSearchAndCategorize
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          personalInfo={personalInfo}
        />

        {/* Results Counter */}
        {!loading && projects.length > 0 && (
          <div className="flex items-center justify-between px-2 animate-in fade-in slide-in-from-top-1 duration-500">
            <p className="text-sm text-muted-foreground font-medium">
              Showing{" "}
              <span className="text-foreground font-bold">
                {projects.length.toLocaleString()}
              </span>{" "}
              {projects.length === 1 ? "project" : "projects"}
              {debouncedSearch && (
                <span>
                  {" "}
                  related to "
                  <span className="text-primary italic">{debouncedSearch}</span>
                  "
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
                className="text-[10px] uppercase tracking-wider font-bold text-primary hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        className="w-full flex-1 min-h-0 overflow-hidden relative group"
      >
        {loading ? (
          <div className="flex flex-col gap-4 w-full">
            <ProjectsSkeletonCard />
            <ProjectsSkeletonCard />
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
          <div className="flex flex-col items-center justify-center h-40 opacity-50">
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
      <ProjectCard project={project} currentUserRole={userRole} />
    </div>
  );
};
