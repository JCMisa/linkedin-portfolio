import { Separator } from "@/components/ui/separator";
import ProjectSearchAndCategorize from "./ProjectSearchAndCategorize";
import ProjectsFeedList from "./ProjectsFeedList";

const ProjectsFeed = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* search and categorize card */}
      <ProjectSearchAndCategorize />

      <Separator orientation="horizontal" className="w-full" />

      {/* projects list */}
      <ProjectsFeedList />
    </div>
  );
};

export default ProjectsFeed;
