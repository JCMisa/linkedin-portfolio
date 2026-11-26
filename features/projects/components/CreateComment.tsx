"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRef, useState } from "react";
import { useCurrentUser } from "@/features/users/hooks";
import {
  useCreateComment,
  useDeleteComment,
  useProjectComments,
  type ProjectComment,
} from "../hooks";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/** Matches the server-side limit in createCommentSchema. */
const COMMENT_MAX = 2000;

const CreateComment = ({
  projectId,
  initialComments,
}: {
  projectId: string;
  initialComments?: ProjectComment[];
}) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState("");
  const { user: currentUser } = useCurrentUser();
  const { data, isLoading: fetchingComments } = useProjectComments(
    projectId,
    initialComments,
  );
  const createMutation = useCreateComment(projectId);
  const deleteMutation = useDeleteComment(projectId);
  const isSubmitting = createMutation.isPending || deleteMutation.isPending;

  // Comments whose author was deleted have no user row; skip them
  const comments = (data ?? []).filter((c) => c.user) as CommentType[];

  const handleSubmit = () => {
    if (!isLoaded || !user) {
      router.push("/sign-in");
      return;
    }
    if (!content.trim() || isSubmitting) return;
    createMutation.mutate(content.trim(), { onSuccess: () => setContent("") });
  };

  const handleDelete = (commentId: string) => {
    if (!user || isSubmitting) return;
    deleteMutation.mutate(commentId);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return "now";
  };

  return (
    <div className="mt-2 w-full rounded-lg p-4">
      {/* Comment Input */}
      <div className="mb-4 flex items-start gap-2">
        <Image
          src={user?.imageUrl || "/empty-img.webp"}
          alt="user-img"
          width={1000}
          height={1000}
          className="h-8 w-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <textarea
            placeholder={
              isLoaded && !user
                ? "Please sign in to comment"
                : "Add a comment..."
            }
            disabled={!isLoaded || !user || isSubmitting}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={COMMENT_MAX}
            aria-label="Comment"
            className="min-h-[60px] w-full resize-none rounded-lg border border-input bg-transparent p-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="mt-2 flex items-center justify-end gap-3">
            {content.length > COMMENT_MAX * 0.8 && (
              <span className="text-xs text-muted-foreground">
                {content.length}/{COMMENT_MAX}
              </span>
            )}
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting || !user}
              className="cursor-pointer rounded-full bg-primary px-4 py-1 text-xs text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {fetchingComments ? (
        <div className="flex items-center justify-center">
          <LoaderCircleIcon className="size-5 animate-spin" />
        </div>
      ) : (
        <div
          ref={commentsContainerRef}
          className="max-h-[300px] space-y-4 overflow-y-auto"
        >
          {comments && comments.length > 0 ? (
            comments.map((comment) => {
              const isCommentOwner =
                user &&
                (comment.user.id === currentUser?.id ||
                  currentUser?.role === "admin")
                  ? true
                  : false;

              return isCommentOwner ? (
                <AlertDialog key={comment.id}>
                  <AlertDialogTrigger asChild>
                    <div
                      className={cn(
                        "group flex cursor-pointer items-start gap-2 rounded-lg p-2 transition-all duration-200 ease-in-out hover:bg-destructive/5",
                      )}
                    >
                      <Image
                        src={comment.user.image || "/empty-img.webp"}
                        alt="commenter-img"
                        width={1000}
                        height={1000}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="rounded-lg px-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold">
                              {comment.user.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground">
                                {formatDate(comment.createdAt)}
                              </span>
                              {/* {user &&
                          (comment.user.id === currentUser?.id ||
                            currentUser?.role === "admin") && (
                            <button
                              onClick={() => handleDelete(comment.id)}
                              className="cursor-pointer"
                              title={
                                currentUser?.role === "admin"
                                  ? "Delete as admin"
                                  : "Delete your comment"
                              }
                            >
                              <TrashIcon className="size-3 text-destructive hover:text-destructive" />
                            </button>
                          )} */}
                            </div>
                          </div>
                          <p className="mt-1 text-xs whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your comment for this project.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          isCommentOwner ? handleDelete(comment.id) : {}
                        }
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <div
                  key={comment.id}
                  className={cn("group flex items-start gap-2 rounded-lg p-2")}
                >
                  <Image
                    src={comment.user.image || "/empty-img.webp"}
                    alt="commenter-img"
                    width={1000}
                    height={1000}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="rounded-lg px-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold">
                          {comment.user.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-xs whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center">
              <p className="text-xs text-muted-foreground">No comments yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateComment;
