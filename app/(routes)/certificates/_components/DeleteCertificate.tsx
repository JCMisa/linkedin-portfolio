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
import { deleteCertificate } from "@/lib/actions/certificates";
import { showConfetti } from "@/lib/utils";
import { LoaderCircleIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
      const result = await deleteCertificate(certificate.id);

      if (result.success) {
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
        <button className="flex items-center justify-center">
          <TrashIcon className="size-3 cursor-pointer hover:text-red-500 transition-colors" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            certificate and remove related data from the servers.
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

export default DeleteCertificate;
