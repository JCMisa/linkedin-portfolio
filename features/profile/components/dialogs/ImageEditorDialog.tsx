"use client";

import { useState } from "react";
import { toast } from "sonner";
import { EditorDialog } from "@/components/forms/EditorDialog";
import { ImageUploadField } from "@/components/forms/ImageUploadField";
import type { UploadFolder } from "@/lib/upload-folders";

interface ImageEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentImageUrl: string | null;
  /** Receives the new URL, or null to remove the image. Should throw on failure. */
  onSave: (imageUrl: string | null) => Promise<void>;
  title: string;
  description?: string;
  folder?: UploadFolder;
}

/** Replace or remove a single image (profile photo, cover photo). */
export const ImageEditorDialog = ({
  open,
  onOpenChange,
  currentImageUrl,
  onSave,
  title,
  description = "Upload a new image or remove the current one.",
  folder = "jcm",
}: ImageEditorDialogProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(currentImageUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Start from the saved image each time the dialog opens (state adjusted
  // during render when the prop flips, instead of a setState-in-effect)
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setImageUrl(currentImageUrl);
  }

  const handleSubmit = async (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    setSaving(true);
    try {
      await onSave(imageUrl);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      onSubmit={handleSubmit}
      isSubmitting={saving}
      submitDisabled={uploading || imageUrl === currentImageUrl}
    >
      <ImageUploadField
        value={imageUrl}
        onChange={setImageUrl}
        folder={folder}
        onUploadingChange={setUploading}
        allowClear
        previewClassName="h-56"
      />
      {!imageUrl && currentImageUrl && (
        <p className="text-xs text-muted-foreground">
          The current image will be removed when you save.
        </p>
      )}
    </EditorDialog>
  );
};
