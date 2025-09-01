import Image from "next/image";
import DeleteProject from "@/components/custom/DeleteProject";
import EditProject from "@/components/custom/EditProject";
import { Button } from "@/components/ui/button";
import { LinkPreview } from "@/components/ui/link-preview";

const ProjectCard = ({
  project,
  currentUserRole,
}: {
  project: ProjectType;
  currentUserRole: string;
}) => {
  return (
    <div className="inter-var">
      <div className="bg-neutral-200 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-primary-500/[0.1] dark:bg-dark dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
        <div className="flex items-center justify-between gap-4">
          <div className="text-xl font-bold text-neutral-600 dark:text-white">
            {project.title}
          </div>
          {currentUserRole && currentUserRole === "admin" && (
            <div className="flex items-center gap-2">
              <EditProject project={project} />
              <DeleteProject project={project} />
            </div>
          )}
        </div>
        <div className="text-neutral-500 text-sm mt-2 dark:text-neutral-300">
          {project.description}
        </div>
        <div className="w-full mt-4">
          <Image
            src={project.image || "/empty-img.webp"}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </div>
        <div className="flex justify-between items-center mt-5">
          <Button
            asChild
            disabled={!project.githubLink}
            className="px-4 py-2 rounded-md text-xs font-normal dark:text-white bg-neutral-100 dark:bg-neutral-900 min-w-32 max-w-32 flex items-center justify-center cursor-pointer"
          >
            <LinkPreview
              url={project.githubLink || "#"}
              className={`font-bold ${
                project.githubLink ? "" : "text-gray-400 line-through"
              }`}
            >
              Github
            </LinkPreview>
          </Button>
          <Button
            asChild
            disabled={!project.liveLink}
            className="px-4 py-2 rounded-md bg-primary text-white text-xs font-bold min-w-32 max-w-32 flex items-center justify-center cursor-pointer"
          >
            <LinkPreview
              url={project.liveLink || "#"}
              className={`font-bold ${
                project.liveLink ? "" : "text-gray-400 line-through"
              }`}
            >
              Live
            </LinkPreview>
          </Button>
        </div>

        <span className="text-xs text-muted-foreground max-w-sm mt-5">
          {project.techStacks && project.techStacks.length > 0
            ? project.techStacks.join(" | ")
            : "No tech stacks"}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
