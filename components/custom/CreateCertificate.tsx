"use client";

import { Calendar } from "@/components/ui/calendar"; // shadcn
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  PlusIcon,
  AlertCircleIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { format } from "date-fns";
import { cn, showConfetti } from "@/lib/utils";
import { Button } from "../ui/button";
import { FocusEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { addCertificate } from "@/lib/actions/certificates";
import { FileUpload } from "../ui/file-upload";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import Image from "next/image";

const CreateCertificate = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    acquiredDate: new Date(),
  });
  const [dateOpen, setDateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState({
    imageUrl: false,
  });

  const touch = (k: keyof typeof touched) =>
    setTouched((prev) => ({ ...prev, [k]: true }));

  // For Cloudinary URLs, we accept any valid URL (not just image extensions)
  const imageValid =
    !formData.imageUrl ||
    formData.imageUrl.trim().startsWith("http") ||
    /^https?:\/\/.+\.(png|jpe?g|webp|svg)$/i.test(formData.imageUrl.trim());

  const handleBlur =
    (k: keyof typeof touched) => (e: FocusEvent<HTMLInputElement>) => {
      touch(k);
      setFormData((prev) => ({
        ...prev,
        [k]: e.target.value.trim(),
      }));
    };

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
    setIsSubmitting(true);
    try {
      const res = await addCertificate(formData);
      if (res?.success) {
        toast.success(`${res.data} created successfully!`);
        showConfetti();
        setOpen(false);
        setFormData({
          title: "",
          description: "",
          imageUrl: "",
          acquiredDate: new Date(),
        });
        setFiles([]);
        setUploadedImageUrl("");
        setTouched({ imageUrl: false });
      } else {
        toast.error("Could not create certificate");
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
    !isUploading;

  /* ---------- render ---------- */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center justify-center">
        <PlusIcon className="size-4 cursor-pointer" />
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Add New Certificate</DialogTitle>
          <DialogDescription>
            Provide the details to add a new certificate.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Certificate Title</label>
            <Input
              name="title"
              placeholder="Enter certificate title"
              value={formData.title}
              onChange={(e) =>
                setFormData((p) => ({ ...p, title: e.target.value }))
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              placeholder="Describe your certificate"
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              rows={4}
            />
          </div>

          {/* Certificate Image */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Certificate Image</label>
            <FileUpload onChange={handleFileUpload} />
            {isUploading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <LoaderCircleIcon className="size-3 animate-spin" />
                <span>Uploading image...</span>
              </div>
            )}
            {uploadedImageUrl && !isUploading && (
              <div className="mt-2 space-y-2">
                <p className="text-xs text-muted-foreground">
                  Image uploaded successfully!
                </p>
                <div className="relative w-full h-48 rounded-md overflow-hidden border">
                  <Image
                    src={uploadedImageUrl}
                    alt="Certificate preview"
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

          {/* Acquired Date Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Acquired Date</label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
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
                  onSelect={(date) => {
                    if (date) {
                      setFormData((p) => ({ ...p, acquiredDate: date }));
                      setDateOpen(false);
                    }
                  }}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!canSubmit || isSubmitting || isUploading}
          >
            {isSubmitting ? (
              <LoaderCircleIcon className="size-5 animate-spin" />
            ) : (
              "Create Certificate"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCertificate;
