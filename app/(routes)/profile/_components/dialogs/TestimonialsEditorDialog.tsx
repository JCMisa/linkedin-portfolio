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
import { updateTopVoices } from "@/lib/actions/profileInfo";
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
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import Image from "next/image";

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
    value: string
  ) => {
    setTestimonials(
      testimonials.map((t) =>
        t.id === id
          ? { ...t, [field]: value, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const handleImageUpload = async (id: string, files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(id);
    try {
      const imageUrl = await uploadImageToCloudinary(
        files[0],
        "jcm/testimonials"
      );
      if (imageUrl) {
        handleUpdateTestimonial(id, "profileImg", imageUrl);
        toast.success("Image uploaded!");
      }
    } catch (error) {
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
      const result = await updateTopVoices(testimonials);
      if (result && result.success) {
        toast.success("Testimonials updated successfully!");
        showConfetti();
        setIsDialogOpen(false);
      } else {
        toast.error(result?.error || "Failed to update testimonials");
      }
    } catch (error) {
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
          className="flex-none flex items-center justify-center rounded-full w-7 h-7 cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out shadow-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black"
        >
          <PenBoxIcon className="size-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <QuoteIcon className="size-5 text-primary" />
            Edit Top Voices
          </DialogTitle>
          <DialogDescription>
            Manage testimonials and praise from your network.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4 overflow-y-auto no-scrollbar">
          <div className="space-y-6 pb-6">
            <Button
              variant="outline"
              className="w-full h-12 border-dashed border-2 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
              onClick={handleAddTestimonial}
            >
              <PlusIcon className="size-4" />
              Add New Testimonial
            </Button>

            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 space-y-4 relative"
              >
                <button
                  onClick={() => handleRemoveTestimonial(testimonial.id)}
                  className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                >
                  <Trash2Icon className="size-4" />
                </button>

                <div className="grid grid-cols-1 gap-4 pt-2">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                        <UserIcon className="size-3" /> Full Name
                      </Label>
                      <Input
                        placeholder="e.g. Jane Doe"
                        value={testimonial.name}
                        onChange={(e) =>
                          handleUpdateTestimonial(
                            testimonial.id,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                        Company/Handle
                      </Label>
                      <Input
                        placeholder="e.g. @janedoe or CEO at Google"
                        value={testimonial.company}
                        onChange={(e) =>
                          handleUpdateTestimonial(
                            testimonial.id,
                            "company",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                        Profile Image
                      </Label>
                      <div className="flex flex-col gap-4 items-center">
                        <div className="relative size-16 rounded-full border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-dark shrink-0">
                          {testimonial.profileImg ? (
                            <Image
                              src={testimonial.profileImg}
                              alt="preview"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                              <UserIcon className="size-8" />
                            </div>
                          )}
                          {isUploading === testimonial.id && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2Icon className="size-5 text-white animate-spin" />
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
                    <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1">
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
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 border-t">
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
