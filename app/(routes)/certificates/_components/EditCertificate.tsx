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
import { useState, FocusEvent } from "react";

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
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState({ imageUrl: false });

  const touch = (k: keyof typeof touched) =>
    setTouched((prev) => ({ ...prev, [k]: true }));

  const imageValid =
    !formData.imageUrl ||
    /^https?:\/\/.+\.(png|jpe?g|webp|svg)$/i.test(formData.imageUrl.trim());

  const hasChanges = () =>
    formData.title !== certificate.title ||
    formData.description !== (certificate.description || "") ||
    formData.imageUrl !== (certificate.image || "") ||
    formData.acquiredDate !== certificate.acquiredDate;

  const handleBlur =
    (k: keyof typeof touched) => (e: FocusEvent<HTMLInputElement>) => {
      touch(k);
      setFormData((prev) => ({ ...prev, [k]: e.target.value.trim() }));
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
    formData.title && formData.acquiredDate && imageValid && hasChanges();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center">
          <EditIcon className="size-3 cursor-pointer hover:text-primary" />
        </button>
      </DialogTrigger>

      <DialogContent>
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

          <div className="space-y-1">
            <label className="text-sm font-medium">Image URL</label>
            <Input
              placeholder="https://example.com/image.png"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData((p) => ({ ...p, imageUrl: e.target.value }))
              }
              onBlur={handleBlur("imageUrl")}
              className={cn(
                touched.imageUrl &&
                  !imageValid &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            {touched.imageUrl && !imageValid && (
              <p className="text-xs text-destructive">
                Must be a valid URL ending in .png, .jpg, .jpeg, .webp or .svg
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
            disabled={!canSubmit || isSubmitting}
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
