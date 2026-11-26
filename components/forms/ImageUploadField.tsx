"use client";

import { useState } from "react";
import Image from "next/image";
import { LoaderCircleIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import type { UploadFolder } from "@/lib/upload-folders";
import { uploadImageFile } from "@/lib/upload-image";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  folder: UploadFolder;
  /** Reports upload progress so the parent can block submit meanwhile. */
  onUploadingChange?: (uploading: boolean) => void;
  allowClear?: boolean;
  previewClassName?: string;
}

/** Drag-and-drop image picker that uploads to Cloudinary and stores the URL. */
export function ImageUploadField({
  value,
  onChange,
  folder,
  onUploadingChange,
  allowClear = false,
  previewClassName = "h-48",
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  const setBusy = (busy: boolean) => {
    setUploading(busy);
    onUploadingChange?.(busy);
  };

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadImageFile(file, folder));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <FileUpload onChange={handleFiles} />

      {uploading && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <LoaderCircleIcon className="size-3 animate-spin" />
          Uploading image...
        </p>
      )}

      {value && !uploading && (
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-md border",
            previewClassName,
          )}
        >
          <Image
            src={value}
            alt="Uploaded preview"
            fill
            className="object-cover"
          />
          {allowClear && (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 size-7"
              onClick={() => onChange(null)}
              aria-label="Remove image"
            >
              <XIcon className="size-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
