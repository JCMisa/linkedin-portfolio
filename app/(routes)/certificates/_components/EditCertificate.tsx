"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, EditIcon, LoaderCircleIcon } from "lucide-react";
import { format } from "date-fns";
import { cn, showConfetti } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateCertificate } from "@/lib/actions/certificates";
import { useState, FocusEvent, useEffect, useRef } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { uploadImageToCloudinary } from "@/lib/actions/cloudinary";
import Image from "next/image";

const EditCertificate = ({ certificate }: { certificate: CertificateType }) => {
  // pre-fill
  const [formData, setFormData] = useState({
    title: certificate.title || "",
    description: certificate.description || "",
    imageUrl: certificate.image || "",
    acquiredDate: certificate.acquiredDate || new Date(),
  });

  const [dateOpen, setDateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState({ imageUrl: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const touch = (k: keyof typeof touched) =>
    setTouched((prev) => ({ ...prev, [k]: true }));

  // For Cloudinary URLs, we accept any valid URL (not just image extensions)
  const imageValid =
    !formData.imageUrl ||
    formData.imageUrl.trim().startsWith("http") ||
    /^https?:\/\/.+\.(png|jpe?g|webp|svg)$/i.test(formData.imageUrl.trim());

  const hasChanges = () => {
    // Compare dates by converting to ISO strings for accurate comparison
    const formDate = formData.acquiredDate
      ? formData.acquiredDate instanceof Date
        ? formData.acquiredDate.toISOString()
        : new Date(formData.acquiredDate).toISOString()
      : "";
    const certDate = certificate.acquiredDate
      ? certificate.acquiredDate instanceof Date
        ? certificate.acquiredDate.toISOString()
        : new Date(certificate.acquiredDate).toISOString()
      : "";

    return (
      formData.title !== certificate.title ||
      formData.description !== (certificate.description || "") ||
      formData.imageUrl !== (certificate.image || "") ||
      formDate !== certDate
    );
  };

  const handleBlur =
    (k: keyof typeof touched) => (e: FocusEvent<HTMLInputElement>) => {
      touch(k);
      setFormData((prev) => ({ ...prev, [k]: e.target.value.trim() }));
    };

  /* ---------- reset form when dialog re-opens ---------- */
  useEffect(() => {
    if (!open) return;
    setFormData({
      title: certificate.title || "",
      description: certificate.description || "",
      imageUrl: certificate.image || "",
      acquiredDate: certificate.acquiredDate || new Date(),
    });
    setFiles([]);
    setUploadedImageUrl("");
    setTouched({ imageUrl: false });
  }, [open, certificate]);

  /* ---------- image upload handler ---------- */
  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setFiles(files);
    setIsUploading(true);

    try {
      const file = files[0];
      const imageUrl = await uploadImageToCloudinary(file, "jcm");

      if (imageUrl) {
        setUploadedImageUrl(imageUrl);
        setFormData((prev) => ({ ...prev, imageUrl }));
        setTouched((prev) => ({ ...prev, imageUrl: true }));
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

  const handleSubmit = async () => {
    if (!hasChanges()) return;
    setIsSubmitting(true);
    try {
      const res = await updateCertificate(certificate.id, formData);
      if (res.success) {
        toast.success(`${res.data} updated successfully!`);
        showConfetti();
        setOpen(false);
      } else {
        toast.error("Could not update certificate");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    formData.title &&
    formData.acquiredDate &&
    formData.imageUrl &&
    imageValid &&
    hasChanges() &&
    !isUploading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center">
          <EditIcon className="size-3 cursor-pointer hover:text-primary" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Edit Certificate</DialogTitle>
          <DialogDescription>
            Update the details for {certificate.title}
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <div className="space-y-4 py-4">
          <Input
            placeholder="Certificate title"
            value={formData.title}
            onChange={(e) =>
              setFormData((p) => ({ ...p, title: e.target.value }))
            }
          />

          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData((p) => ({ ...p, description: e.target.value }))
            }
            rows={4}
          />

          {/* Certificate Image */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Certificate Image</label>

            {/* Hidden file input for clicking preview */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={(e) => {
                const selectedFiles = Array.from(e.target.files || []);
                if (selectedFiles.length > 0) {
                  handleFileUpload([selectedFiles[0]]);
                }
              }}
            />

            {/* Current Image Preview - Clickable to upload new */}
            {formData.imageUrl && !uploadedImageUrl && (
              <div className="space-y-2 mb-4">
                <p className="text-xs text-muted-foreground">
                  Current image (click image to upload a new one)
                </p>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full h-48 rounded-md overflow-hidden border cursor-pointer group"
                >
                  <Image
                    src={formData.imageUrl || "/empty-img.webp"}
                    alt="Current certificate image"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                    <p className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                      Click to upload new image
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* File Upload Component */}
            {isUploading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <LoaderCircleIcon className="size-3 animate-spin" />
                <span>Uploading image...</span>
              </div>
            )}

            {/* New Uploaded Image Preview */}
            {uploadedImageUrl && !isUploading && (
              <div className="mt-2 space-y-2">
                <p className="text-xs text-muted-foreground">
                  New image uploaded successfully!
                </p>
                <div className="relative w-full h-48 rounded-md overflow-hidden border">
                  <Image
                    src={uploadedImageUrl}
                    alt="New certificate image preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {touched.imageUrl && !imageValid && (
              <p className="text-xs text-destructive">
                Must be a valid image URL
              </p>
            )}
          </div>

          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start",
                  !formData.acquiredDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.acquiredDate
                  ? format(formData.acquiredDate, "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.acquiredDate}
                onSelect={(d) => {
                  if (d) {
                    setFormData((p) => ({ ...p, acquiredDate: d }));
                    setDateOpen(false);
                  }
                }}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting || isUploading}
            className="w-full"
          >
            {isSubmitting ? (
              <LoaderCircleIcon className="size-5 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCertificate;
