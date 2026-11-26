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
import { deleteCertificate } from "@/features/certificates/actions";
import { showConfetti } from "@/lib/confetti";
import { LoaderCircleIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getActionError } from "@/lib/action-result";

const DeleteCertificate = ({
  certificate,
}: {
  certificate: CertificateType;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteCertificate({ certificateId: certificate.id });
      const error = getActionError(result);
      if (error) {
        toast.error(error);
      } else {
        showConfetti();
        setOpen(false);
        toast.success(`Certificate deleted successfully`);
      }
    } catch (error) {
      console.log("Error deleting certificate: ", error);
      toast.error("Failed to delete the certificate");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          aria-label="Delete certificate"
          title="Delete certificate"
          className="flex cursor-pointer items-center justify-center rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
        >
          <TrashIcon className="size-3.5" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this certificate?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            certificate and remove related data from the servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive"
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

export default DeleteCertificate;
