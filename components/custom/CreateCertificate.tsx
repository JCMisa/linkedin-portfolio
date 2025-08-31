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

const CreateCertificate = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    acquiredDate: new Date(),
  });
  const [dateOpen, setDateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState({
    imageUrl: false,
  });

  const touch = (k: keyof typeof touched) =>
    setTouched((prev) => ({ ...prev, [k]: true }));

  const imageValid =
    !formData.imageUrl ||
    /^https?:\/\/.+\.(png|jpe?g|webp|svg)$/i.test(formData.imageUrl.trim());

  const handleBlur =
    (k: keyof typeof touched) => (e: FocusEvent<HTMLInputElement>) => {
      touch(k);
      setFormData((prev) => ({
        ...prev,
        [k]: e.target.value.trim(),
      }));
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
        setTouched({ imageUrl: false });
      } else {
        toast.error("Could not create certificate");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = formData.title && formData.acquiredDate && imageValid;

  /* ---------- render ---------- */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center justify-center">
        <PlusIcon className="size-4 cursor-pointer" />
      </DialogTrigger>

      <DialogContent>
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

          {/* Image URL */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Image URL</label>
            <div className="relative">
              <Input
                name="imageUrl"
                placeholder="https://example.com/image.png"
                value={formData.imageUrl}
                onBlur={handleBlur("imageUrl")}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, imageUrl: e.target.value }))
                }
                className={cn(
                  touched.imageUrl &&
                    !imageValid &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              />
              {touched.imageUrl && !imageValid && (
                <AlertCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
              )}
            </div>
            {!imageValid && formData.imageUrl && (
              <p className="text-xs text-destructive">
                Must be a valid URL ending in .png, .jpg, .jpeg, .webp or .svg
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
            disabled={!canSubmit || isSubmitting}
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
