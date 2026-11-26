"use client";

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
import { deleteProject } from "@/features/projects/actions/projects";
import { showConfetti } from "@/lib/confetti";
import { LoaderCircleIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getActionError } from "@/lib/action-result";

const DeleteProject = ({ project }: { project: ProjectType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteProject({ projectId: project.id });
      const error = getActionError(result);
      if (error) {
        toast.error(error);
      } else {
        showConfetti();
        setOpen(false);
        toast.success(`Project deleted successfully`);
      }
    } catch (error) {
      console.log("Error deleting project: ", error);
      toast.error("Failed to delete the project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className="flex items-center justify-center">
          <TrashIcon className="size-3 cursor-pointer transition-colors hover:text-red-500" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            project and remove related data from the servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircleIcon className="size-4 animate-spin" />
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProject;
