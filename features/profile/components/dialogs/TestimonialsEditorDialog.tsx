"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateTopVoices } from "@/features/profile/actions";
import {
  Loader2Icon,
  PlusIcon,
  Trash2Icon,
  PenBoxIcon,
  UserIcon,
  QuoteIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { showConfetti } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUpload } from "@/components/ui/file-upload";
import { uploadImageFile } from "@/lib/upload-image";
import Image from "next/image";
import { getActionError } from "@/lib/action-result";

type TopVoicesType = {
  id: string;
  name: string;
  profileImg: string;
  company: string;
  comment: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

interface TestimonialsEditorDialogProps {
  currentTestimonials: TopVoicesType[];
}

const TestimonialsEditorDialog = ({
  currentTestimonials,
}: TestimonialsEditorDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [testimonials, setTestimonials] =
    useState<TopVoicesType[]>(currentTestimonials);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  useEffect(() => {
    if (isDialogOpen) {
      setTestimonials(currentTestimonials);
    }
  }, [isDialogOpen, currentTestimonials]);

  const handleAddTestimonial = () => {
    const newTestimonial: TopVoicesType = {
      id: crypto.randomUUID(),
      name: "",
      profileImg: "",
      company: "",
      comment: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTestimonials([newTestimonial, ...testimonials]);
  };

  const handleRemoveTestimonial = (id: string) => {
    setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  const handleUpdateTestimonial = (
    id: string,
    field: keyof TopVoicesType,
    value: string,
  ) => {
    setTestimonials(
      testimonials.map((t) =>
        t.id === id
          ? { ...t, [field]: value, updatedAt: new Date().toISOString() }
          : t,
      ),
    );
  };

  const handleImageUpload = async (id: string, files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(id);
    try {
      const imageUrl = await uploadImageFile(files[0], "jcm/testimonials");
      if (imageUrl) {
        handleUpdateTestimonial(id, "profileImg", imageUrl);
        toast.success("Image uploaded!");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(null);
    }
  };

  const handleSave = async () => {
    // Basic validation
    if (testimonials.some((t) => !t.name.trim() || !t.comment.trim())) {
      toast.error("Name and comment are required for all testimonials.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateTopVoices({ topVoices: testimonials });
      const error = getActionError(result);
      if (!error) {
        toast.success("Testimonials updated successfully!");
        showConfetti();
        setIsDialogOpen(false);
      } else {
        toast.error(error ?? "Failed to update testimonials");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    JSON.stringify(testimonials) !== JSON.stringify(currentTestimonials);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div
          onClick={() => setIsDialogOpen(true)}
          className="flex h-7 w-7 flex-none cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-all duration-200 ease-in-out hover:scale-105 dark:bg-neutral-100 dark:text-black"
        >
          <PenBoxIcon className="size-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <QuoteIcon className="size-5 text-primary" />
            Edit Top Voices
          </DialogTitle>
          <DialogDescription>
            Manage testimonials and praise from your network.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="no-scrollbar flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6 pb-6">
            <Button
              variant="outline"
              className="flex h-12 w-full items-center justify-center gap-2 border-2 border-dashed transition-all hover:border-primary hover:text-primary"
              onClick={handleAddTestimonial}
            >
              <PlusIcon className="size-4" />
              Add New Testimonial
            </Button>

            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="relative space-y-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50"
              >
                <button
                  onClick={() => handleRemoveTestimonial(testimonial.id)}
                  className="absolute top-4 right-4 rounded-lg p-1.5 text-neutral-400 transition-all hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2Icon className="size-4" />
                </button>

                <div className="grid grid-cols-1 gap-4 pt-2">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                        <UserIcon className="size-3" /> Full Name
                      </Label>
                      <Input
                        placeholder="e.g. Jane Doe"
                        value={testimonial.name}
                        onChange={(e) =>
                          handleUpdateTestimonial(
                            testimonial.id,
                            "name",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                        Company/Handle
                      </Label>
                      <Input
                        placeholder="e.g. @janedoe or CEO at Google"
                        value={testimonial.company}
                        onChange={(e) =>
                          handleUpdateTestimonial(
                            testimonial.id,
                            "company",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                        Profile Image
                      </Label>
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-dark">
                          {testimonial.profileImg ? (
                            <Image
                              src={testimonial.profileImg}
                              alt="preview"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-neutral-300">
                              <UserIcon className="size-8" />
                            </div>
                          )}
                          {isUploading === testimonial.id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                              <Loader2Icon className="size-5 animate-spin text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <FileUpload
                            onChange={(files) =>
                              handleImageUpload(testimonial.id, files)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                      Comment / Testimonial
                    </Label>
                    <Textarea
                      placeholder="What did they say about you?"
                      className="h-[calc(100%-25px)] min-h-[150px] resize-none"
                      value={testimonial.comment}
                      onChange={(e) =>
                        handleUpdateTestimonial(
                          testimonial.id,
                          "comment",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="border-t p-6 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges || isUploading !== null}
            className="min-w-[120px] bg-primary hover:bg-primary-600"
          >
            {isSaving ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialsEditorDialog;
