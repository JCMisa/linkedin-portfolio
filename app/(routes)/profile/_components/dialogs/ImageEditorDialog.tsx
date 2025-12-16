"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import Image from "next/image";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import { Trash2Icon, Loader2Icon } from "lucide-react";

interface ImageEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentImageUrl: string | null;
  onSave: (imageUrl: string | null) => Promise<void>;
  title: string;
  description?: string;
  folder?: string;
}

export const ImageEditorDialog = ({
  open,
  onOpenChange,
  currentImageUrl,
  onSave,
  title,
  description = "Upload a new image or delete the current one",
  folder = "jcm",
}: ImageEditorDialogProps) => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    currentImageUrl
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Sync with currentImageUrl when dialog opens
  useEffect(() => {
    if (open) {
      setUploadedImageUrl(currentImageUrl);
      setFiles([]);
    }
  }, [open, currentImageUrl]);

  // Reset state when dialog opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset to current image when closing
      setUploadedImageUrl(currentImageUrl);
      setFiles([]);
    }
    onOpenChange(newOpen);
  };

  const handleFileUpload = async (uploadedFiles: File[]) => {
    if (uploadedFiles.length === 0) return;

    setFiles(uploadedFiles);
    setIsUploading(true);

    try {
      const file = uploadedFiles[0];
      const imageUrl = await uploadImageToCloudinary(file, folder);

      if (imageUrl) {
        setUploadedImageUrl(imageUrl);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    setUploadedImageUrl(null);
    setFiles([]);
    toast.info("Image marked for deletion. Click Save to confirm.");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(uploadedImageUrl);
      toast.success("Image updated successfully!");
      handleOpenChange(false);
    } catch (error) {
      console.error("Error saving image:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save image. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = uploadedImageUrl !== currentImageUrl;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 h-[30rem] overflow-y-auto no-scrollbar">
          {/* Current/Preview Image */}
          <div className="relative w-full h-64 rounded-lg overflow-hidden border bg-neutral-100 dark:bg-neutral-800">
            {uploadedImageUrl ? (
              <Image
                src={uploadedImageUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <p>No image</p>
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <FileUpload onChange={handleFileUpload} />
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2Icon className="size-4 animate-spin" />
                <span>Uploading image...</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={!uploadedImageUrl || isSaving}
              className="flex items-center gap-2"
            >
              <Trash2Icon className="size-4" />
              Delete Image
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={!hasChanges || isSaving || isUploading}
                className="flex items-center gap-2"
              >
                {isSaving && <Loader2Icon className="size-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
