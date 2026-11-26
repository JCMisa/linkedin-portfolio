"use client";

import Image from "next/image";
import { MoreHorizontal, Trash2, Reply } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { deleteComment } from "@/features/projects/actions/comments";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useState } from "react";

const ProjectComments = ({ initialComments }: { initialComments: any[] }) => {
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
      <div className="rounded-lg border-2 border-dashed border-border py-10 text-center">
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
          <div key={comment.id} className="group flex gap-3">
            {/* Avatar */}
            <Image
              src={comment.user?.image || "/empty-img.webp"}
              alt={comment.user?.name || "User"}
              width={40}
              height={40}
              className="size-10 flex-none rounded-full border border-border object-cover"
            />

            {/* Comment Bubble */}
            <div className="flex flex-1 flex-col gap-1">
              <div className="relative rounded-2xl rounded-tl-none bg-secondary/50 p-3 dark:bg-secondary/20">
                {/* Header info */}
                <div className="mb-1 flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="cursor-pointer text-xs font-bold hover:underline">
                      {comment.user?.name}
                    </span>
                    <span className="line-clamp-1 text-[10px] text-muted-foreground">
                      {comment.user?.role || "Community Member"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] whitespace-nowrap text-muted-foreground">
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
                            className="size-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-32 p-1">
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive/10"
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
                <p className="text-xs leading-relaxed whitespace-pre-wrap text-foreground/90">
                  {comment.content}
                </p>
              </div>

              {/* Action Buttons (Like/Reply) */}
              <div className="flex items-center gap-4 px-1">
                <button className="text-[11px] font-bold text-muted-foreground transition-colors hover:text-primary">
                  Like
                </button>
                <div className="size-1 rounded-full bg-muted-foreground/30" />
                <button className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground transition-colors hover:text-primary">
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

export default ProjectComments;
