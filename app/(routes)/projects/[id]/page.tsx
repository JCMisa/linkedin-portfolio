import { getProjectById } from "@/lib/actions/projects";
import { getProjectLikesWithUserDetails } from "@/lib/actions/likes";
import { getProjectComments } from "@/lib/actions/comments";
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
import CreateComment from "@/components/custom/CreateComment";
import { FaGithub } from "react-icons/fa";
// import ProjectCommentsList from "../_components/ProjectCommentsList";
import { LikesType } from "@/config/schema";

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
    <main className="min-h-screen bg-secondary/30 py-13 lg:py-17 px-4 md:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 w-fit group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Feed</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Project Cover & Basic Info Card */}
            <section className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="relative w-full aspect-video bg-muted">
                <Image
                  src={project.image || "/empty-img.webp"}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground capitalize">
                      {project.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
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
                  <h3 className="text-lg font-semibold mb-2">
                    About this project
                  </h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {project.description}
                  </p>
                </div>
              </div>
            </section>

            {/* Comments Section Card */}
            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="size-5 text-primary" />
                <h2 className="text-xl font-bold">
                  Discussion ({comments.length})
                </h2>
              </div>

              <CreateComment projectId={id} />

              {/* <div className="mt-8">
                <ProjectCommentsList initialComments={comments} />
              </div> */}
            </section>
          </div>

          {/* RIGHT COLUMN: Sidebar Details */}
          <div className="flex flex-col gap-6">
            {/* Actions & Links Card */}
            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                Project Assets
              </h3>
              <div className="flex flex-col gap-3">
                {project.liveLink && (
                  <Link
                    href={project.liveLink}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white rounded-full font-semibold hover:bg-primary-600 transition-colors"
                  >
                    <Globe className="size-4" />
                    Live Demo
                  </Link>
                )}
                {project.githubLink && (
                  <Link
                    href={project.githubLink}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full py-2.5 border border-primary text-primary rounded-full font-semibold hover:bg-primary/5 transition-colors"
                  >
                    <FaGithub className="size-4" />
                    Source Code
                  </Link>
                )}
              </div>
            </section>

            {/* Tech Stack Card */}
            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStacks?.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-md border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {/* People who liked this project */}
            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <ThumbsUp className="size-4 text-primary fill-primary" />
                </div>
                <h3 className="font-bold text-sm text-foreground">
                  Reactions ({likesWithUser.length})
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                {likesWithUser.slice(0, 5).map((like, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="relative flex-none">
                      <Image
                        src={like.userImage || "/empty-img.webp"}
                        alt={like.userName || "User"}
                        width={36}
                        height={36}
                        className="rounded-full size-9 object-cover border border-border group-hover:border-primary transition-colors"
                      />
                      {/* Small blue dot/badge for "Connection" feel */}
                      {/* <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-green-500 border-2 border-card rounded-full" /> */}
                    </div>

                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-bold text-foreground group-hover:text-primary group-hover:underline truncate transition-colors">
                        {like.userName}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate capitalize">
                        {like.userRole || "Member"}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Footer of the Reactions list */}
                {likesWithUser.length > 5 ? (
                  <button className="text-xs font-semibold text-primary hover:bg-primary/5 py-2 rounded-md transition-colors w-full text-center border-t border-border mt-2 pt-4">
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
