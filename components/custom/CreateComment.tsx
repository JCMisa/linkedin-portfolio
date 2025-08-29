import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  createComment,
  deleteComment,
  getProjectComments,
} from "@/lib/actions/comments";
import { getCurrentUser } from "@/lib/actions/users";
import { LoaderCircleIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const CreateComment = ({ projectId }: { projectId: string }) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType>();
  const [fetchingComments, setFetchingComments] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch comments
      setFetchingComments(true);
      const commentsResult = await getProjectComments(projectId);
      if (commentsResult.success) {
        setComments(commentsResult.data as CommentType[]);
        setFetchingComments(false);
      }

      // Fetch user role if user is logged in
      if (user) {
        try {
          const data = await getCurrentUser();
          if (data) {
            setCurrentUser(data);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchData();
  }, [projectId, user]);

  const handleSubmit = async () => {
    if (!isLoaded || !user) {
      router.push("/sign-in");
      return;
    }

    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await createComment(projectId, content.trim());
      if (result.success && result.data) {
        setContent("");
        // Add the new comment to the list
        const newComment: CommentType = {
          id: result.data.id,
          content: result.data.content,
          createdAt: result.data.createdAt,
          user: {
            id: parseInt(user.id),
            name: user.fullName || user.username || "User",
            image: user.imageUrl || null,
            role: currentUser?.role,
          },
        };
        setComments((prev) => [newComment, ...prev]);
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await deleteComment(commentId);
      if (result.success) {
        // Remove the comment from the list
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="w-full mt-2 rounded-lg p-4">
      {/* Comment Input */}
      <div className="flex items-start gap-2 mb-4">
        <Image
          src={user?.imageUrl || "/empty-img.webp"}
          alt="user-img"
          width={1000}
          height={1000}
          className="w-8 h-8 rounded-full object-cover"
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
            className="w-full min-h-[60px] p-2 text-xs rounded-lg border border-gray-600 dark:border-gray-400 focus:outline-none focus:ring-1 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting || !user}
              className="px-4 py-1 text-xs bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="space-y-4 max-h-[300px] overflow-y-auto"
        >
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-center gap-2 group">
                <Image
                  src={comment.user.image || "/empty-img.webp"}
                  alt="commenter-img"
                  width={1000}
                  height={1000}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold">
                        {comment.user.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                        {user &&
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
                              <TrashIcon className="size-3 text-red-500 hover:text-red-600" />
                            </button>
                          )}
                      </div>
                    </div>
                    <p className="text-xs mt-1">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
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
