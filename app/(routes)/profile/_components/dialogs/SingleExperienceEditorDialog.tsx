"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import { Loader2Icon, CalendarIcon, XIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ExperienceType = {
  id: string;
  title: string;
  description: string;
  bannerImg: string;
  dateFrom: string;
  dateTo: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

interface SingleExperienceEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: ExperienceType;
  onSave: (updatedExperience: ExperienceType) => Promise<void>;
}

export const SingleExperienceEditorDialog = ({
  open,
  onOpenChange,
  experience: initialExperience,
  onSave,
}: SingleExperienceEditorDialogProps) => {
  const [experience, setExperience] =
    useState<ExperienceType>(initialExperience);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setExperience({ ...initialExperience });
    }
  }, [open, initialExperience]);

  const updateField = (field: keyof ExperienceType, value: any) => {
    setExperience((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date(),
    }));
  };

  const handleBannerUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const imageUrl = await uploadImageToCloudinary(file, "jcm/experiences");

      if (imageUrl) {
        updateField("bannerImg", imageUrl);
        toast.success("Banner image uploaded successfully!");
      } else {
        toast.error("Failed to upload banner image");
      }
    } catch (error) {
      console.error("Error uploading banner image:", error);
      toast.error("Failed to upload banner image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!experience.title.trim() || !experience.description.trim()) {
      toast.error("Please fill in all required fields (title and description)");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(experience);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving experience:", error);
      toast.error("Failed to save experience. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Experience</DialogTitle>
          <DialogDescription>
            Update the details of this experience
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-2 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={experience.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g., Frontend Developer at Company"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={experience.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe your role and responsibilities..."
              rows={6}
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !experience.dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {experience.dateFrom ? (
                      format(new Date(experience.dateFrom), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={
                      experience.dateFrom
                        ? new Date(experience.dateFrom)
                        : undefined
                    }
                    onSelect={(date) =>
                      updateField(
                        "dateFrom",
                        date ? format(date, "yyyy-MM-dd") : ""
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>
                End Date{" "}
                <span className="text-[9px] text-muted-foreground">
                  (Leave empty for 'Present')
                </span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !experience.dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {experience.dateTo ? (
                      format(new Date(experience.dateTo), "PPP")
                    ) : (
                      <span>Present</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={
                      experience.dateTo
                        ? new Date(experience.dateTo)
                        : undefined
                    }
                    onSelect={(date) =>
                      updateField(
                        "dateTo",
                        date ? format(date, "yyyy-MM-dd") : ""
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {experience.dateTo && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground"
                  onClick={() => updateField("dateTo", "")}
                >
                  Clear End Date
                </Button>
              )}
            </div>
          </div>

          {/* Banner Image */}
          <div className="space-y-2">
            <Label>Banner Image</Label>
            {experience.bannerImg ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                <Image
                  src={experience.bannerImg}
                  alt={`Banner for ${experience.title}`}
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => updateField("bannerImg", "")}
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="relative">
                <FileUpload onChange={handleBannerUpload} />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <Loader2Icon className="size-6 animate-spin text-primary" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving && <Loader2Icon className="size-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
