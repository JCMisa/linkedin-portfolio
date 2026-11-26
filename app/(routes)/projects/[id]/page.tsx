import { getProjectComments } from "@/features/projects/actions/comments";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Globe,
  Calendar,
  Tag,
  ThumbsUp,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import CreateComment from "@/features/projects/components/CreateComment";
import { FaGithub } from "react-icons/fa";
import {
  getProjectById,
  getProjectLikesWithUserDetails,
} from "@/features/projects/queries";
// import ProjectComments from "@/features/projects/components/ProjectComments";

interface ProjectDetailsPageProps {
  params: Promise<{ id: string }>;
}

const ProjectDetailsPage = async ({ params }: ProjectDetailsPageProps) => {
  const { id } = await params;

  // Fetch all data in parallel for speed
  const [projectData, likesWithUsersData, commentsData] = await Promise.all([
    getProjectById(id),
    getProjectLikesWithUserDetails(id),
    getProjectComments(id),
  ]);

  if (!projectData || !projectData.data) notFound();

  const project = projectData.data;
  const likesWithUser = likesWithUsersData.data || [];
  const comments = commentsData.data || [];

  return (
    <main className="min-h-screen bg-secondary/30 px-4 py-13 md:px-10 lg:px-16 lg:py-17">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <Link
          href="/"
          className="group mb-6 flex w-fit items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back to Feed</span>
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT COLUMN: Main Content */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Project Cover & Basic Info Card */}
            <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="relative aspect-video w-full bg-muted">
                <Image
                  src={project.image || "/empty-img.webp"}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground capitalize md:text-3xl">
                      {project.title}
                    </h1>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        {new Date(project.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "long", year: "numeric" },
                        )}
                      </span>
                      <span className="flex items-center gap-1 capitalize">
                        <Tag className="size-4" />
                        {project.category || "General"}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <h3 className="mb-2 text-lg font-semibold">
                    About this project
                  </h3>
                  <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </div>
            </section>

            {/* Comments Section Card */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <MessageSquare className="size-5 text-primary" />
                <h2 className="text-xl font-bold">
                  Discussion ({comments.length})
                </h2>
              </div>

              <CreateComment projectId={id} />

              {/* <div className="mt-8">
                <ProjectComments initialComments={comments} />
              </div> */}
            </section>
          </div>

          {/* RIGHT COLUMN: Sidebar Details */}
          <div className="flex flex-col gap-6">
            {/* Actions & Links Card */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold tracking-wider text-muted-foreground uppercase">
                Project Assets
              </h3>
              <div className="flex flex-col gap-3">
                {project.liveLink && (
                  <Link
                    href={project.liveLink}
                    target="_blank"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 font-semibold text-white transition-colors hover:bg-primary-600"
                  >
                    <Globe className="size-4" />
                    Live Demo
                  </Link>
                )}
                {project.githubLink && (
                  <Link
                    href={project.githubLink}
                    target="_blank"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-primary py-2.5 font-semibold text-primary transition-colors hover:bg-primary/5"
                  >
                    <FaGithub className="size-4" />
                    Source Code
                  </Link>
                )}
              </div>
            </section>

            {/* Tech Stack Card */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold tracking-wider text-muted-foreground uppercase">
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStacks?.map((tech: string) => (
                  <span
                    key={tech}
                    className="rounded-md border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {/* People who liked this project */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <ThumbsUp className="size-4 fill-primary text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  Reactions ({likesWithUser.length})
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                {likesWithUser.slice(0, 5).map((like, index) => (
                  <div
                    key={index}
                    className="group flex cursor-pointer items-center gap-3"
                  >
                    <div className="relative flex-none">
                      <Image
                        src={like.userImage || "/empty-img.webp"}
                        alt={like.userName || "User"}
                        width={36}
                        height={36}
                        className="size-9 rounded-full border border-border object-cover transition-colors group-hover:border-primary"
                      />
                      {/* Small blue dot/badge for "Connection" feel */}
                      {/* <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-green-500 border-2 border-card rounded-full" /> */}
                    </div>

                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate text-xs font-bold text-foreground transition-colors group-hover:text-primary group-hover:underline">
                        {like.userName}
                      </span>
                      <span className="truncate text-[10px] text-muted-foreground capitalize">
                        {like.userRole || "Member"}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Footer of the Reactions list */}
                {likesWithUser.length > 5 ? (
                  <button className="mt-2 w-full rounded-md border-t border-border py-2 pt-4 text-center text-xs font-semibold text-primary transition-colors hover:bg-primary/5">
                    View all {likesWithUser.length} reactions
                  </button>
                ) : likesWithUser.length === 0 ? (
                  <div className="py-4 text-center">
                    <p className="text-xs text-muted-foreground italic">
                      No reactions yet. Be the first!
                    </p>
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProjectDetailsPage;
