"use client";

import Image from "next/image";
import { MoreHorizontal, Trash2, Reply } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { deleteComment } from "@/lib/actions/comments";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useState } from "react";

const ProjectCommentsList = ({
  initialComments,
}: {
  initialComments: any[];
}) => {
  const { user } = useUser();
  const [comments, setComments] = useState(initialComments);

  const handleDelete = async (commentId: string) => {
    const res = await deleteComment(commentId);
    if (res.success) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment deleted");
    } else {
      toast.error("Failed to delete comment");
    }
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-border rounded-lg">
        <p className="text-sm text-muted-foreground">
          No comments yet. Start the conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {comments.map((comment) => {
        const isOwner =
          user?.id === comment.user?.userId ||
          user?.publicMetadata?.role === "admin";

        return (
          <div key={comment.id} className="flex gap-3 group">
            {/* Avatar */}
            <Image
              src={comment.user?.image || "/empty-img.webp"}
              alt={comment.user?.name || "User"}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover flex-none border border-border"
            />

            {/* Comment Bubble */}
            <div className="flex-1 flex flex-col gap-1">
              <div className="bg-secondary/50 dark:bg-secondary/20 rounded-2xl rounded-tl-none p-3 relative">
                {/* Header info */}
                <div className="flex justify-between items-start mb-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold hover:underline cursor-pointer">
                      {comment.user?.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground line-clamp-1">
                      {comment.user?.role || "Community Member"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {Math.ceil(
                        (Date.now() - new Date(comment.createdAt).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}
                      d
                    </span>

                    {isOwner && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-32 p-1">
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10 rounded-sm transition-colors"
                          >
                            <Trash2 className="size-3" />
                            Delete
                          </button>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>

              {/* Action Buttons (Like/Reply) */}
              <div className="flex items-center gap-4 px-1">
                <button className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors">
                  Like
                </button>
                <div className="size-1 bg-muted-foreground/30 rounded-full" />
                <button className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Reply className="size-3" />
                  Reply
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectCommentsList;
