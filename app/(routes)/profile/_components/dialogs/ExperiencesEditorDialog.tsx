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
import {
  Trash2Icon,
  Loader2Icon,
  PlusIcon,
  CalendarIcon,
  XIcon,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ExperienceType = {
  id: string;
  title: string;
  description: string;
  bannerImg: string;
  dateFrom: string;
  dateTo: string;
  createdAt: Date;
  updatedAt: Date;
};

interface ExperiencesEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentExperiences: ExperienceType[];
  onSave: (experiences: ExperienceType[]) => Promise<void>;
}

export const ExperiencesEditorDialog = ({
  open,
  onOpenChange,
  currentExperiences,
  onSave,
}: ExperiencesEditorDialogProps) => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  // Initialize experiences when dialog opens
  useEffect(() => {
    if (open) {
      // Deep clone the experiences to avoid mutating the original
      // Ensure dates are properly handled (createdAt/updatedAt are Date objects, dateFrom/dateTo are strings)
      setExperiences(
        currentExperiences.map((exp) => ({
          ...exp,
          createdAt: exp.createdAt ? new Date(exp.createdAt) : new Date(),
          updatedAt: exp.updatedAt ? new Date(exp.updatedAt) : new Date(),
          dateFrom: exp.dateFrom || "",
          dateTo: exp.dateTo || "",
        }))
      );
    }
  }, [open, currentExperiences]);

  const addExperience = () => {
    const newExperience: ExperienceType = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      bannerImg: "",
      dateFrom: "",
      dateTo: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setExperiences([...experiences, newExperience]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (
    index: number,
    field: keyof ExperienceType,
    value: string | Date
  ) => {
    const updated = [...experiences];
    updated[index] = {
      ...updated[index],
      [field]: value,
      updatedAt: new Date(),
    };
    setExperiences(updated);
  };

  const handleBannerUpload = async (index: number, files: File[]) => {
    if (files.length === 0) return;

    setUploadingIndex(index);
    try {
      const file = files[0];
      const imageUrl = await uploadImageToCloudinary(file, "jcm/experiences");

      if (imageUrl) {
        updateExperience(index, "bannerImg", imageUrl);
        toast.success("Banner image uploaded successfully!");
      } else {
        toast.error("Failed to upload banner image");
      }
    } catch (error) {
      console.error("Error uploading banner image:", error);
      toast.error("Failed to upload banner image. Please try again.");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleDateSelect = (
    index: number,
    field: "dateFrom" | "dateTo",
    date: Date | undefined
  ) => {
    if (date) {
      updateExperience(index, field, format(date, "yyyy-MM-dd"));
    }
  };

  const handleSave = async () => {
    // Validate experiences
    const hasEmptyFields = experiences.some(
      (exp) => !exp.title.trim() || !exp.description.trim()
    );

    if (hasEmptyFields) {
      toast.error("Please fill in all required fields (title and description)");
      return;
    }

    setIsSaving(true);
    try {
      // Ensure dates are properly serialized for JSONB storage
      const experiencesToSave = experiences.map((exp) => ({
        ...exp,
        createdAt:
          exp.createdAt instanceof Date
            ? exp.createdAt.toISOString()
            : exp.createdAt,
        updatedAt: new Date().toISOString(), // Always update to current time
      }));

      await onSave(experiencesToSave as any);
      toast.success("Experiences updated successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving experiences:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save experiences. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    JSON.stringify(experiences) !== JSON.stringify(currentExperiences);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Experiences</DialogTitle>
          <DialogDescription>
            Add, edit, or remove your work experiences
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-2">
          {experiences.map((experience, index) => (
            <div
              key={experience.id}
              className="border rounded-lg p-4 space-y-4 bg-neutral-50 dark:bg-neutral-900"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Experience {index + 1}
                </h3>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeExperience(index)}
                  className="h-8 w-8"
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor={`title-${index}`}>
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`title-${index}`}
                  value={experience.title}
                  onChange={(e) =>
                    updateExperience(index, "title", e.target.value)
                  }
                  placeholder="e.g., Frontend Developer at Company"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor={`description-${index}`}>
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id={`description-${index}`}
                  value={experience.description}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                  placeholder="Describe your role and responsibilities..."
                  rows={4}
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
                          handleDateSelect(index, "dateFrom", date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
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
                          <span>Pick a date</span>
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
                          handleDateSelect(index, "dateTo", date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                      onClick={() => updateExperience(index, "bannerImg", "")}
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <FileUpload
                      onChange={(files) => handleBannerUpload(index, files)}
                    />
                    {uploadingIndex === index && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                        <Loader2Icon className="size-6 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {experiences.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No experiences added yet.</p>
              <p className="text-sm">Click "Add Experience" to get started.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={addExperience}
            className="flex items-center gap-2"
          >
            <PlusIcon className="size-4" />
            Add Experience
          </Button>

          <div className="flex gap-2">
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
              disabled={!hasChanges || isSaving}
              className="flex items-center gap-2"
            >
              {isSaving && <Loader2Icon className="size-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
