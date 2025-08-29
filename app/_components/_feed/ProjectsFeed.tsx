import { Separator } from "@/components/ui/separator";
import ProjectSearchAndCategorize from "./ProjectSearchAndCategorize";
import ProjectsFeedList from "./ProjectsFeedList";
import CreateProject from "@/components/custom/CreateProject";
import { getUserRole } from "@/lib/actions/users";

const ProjectsFeed = async () => {
  const userRole = await getUserRole();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* search and categorize card */}
      <ProjectSearchAndCategorize />

      <div className="flex items-center gap-2 w-full">
        <Separator
          orientation="horizontal"
          className={`${
            userRole === "admin" ? "!w-[93%] sm:!w-[95%]" : "w-full"
          }`}
        />
        {userRole === "admin" && <CreateProject />}
      </div>

      {/* projects list */}
      <ProjectsFeedList />
    </div>
  );
};

export default ProjectsFeed;
