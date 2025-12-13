"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderCircleIcon, PlusIcon, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { useState, KeyboardEvent, FocusEvent } from "react";
import { toast } from "sonner";
import { addProject } from "@/lib/actions/projects";
import { showConfetti } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { FileUpload } from "../ui/file-upload";
import { uploadImageToCloudinary } from "@/lib/actions/cloudinary";

/* ---------- regexes ---------- */
const imageRegex = /^https?:\/\/.+\.(png|jpe?g|webp|svg)$/i;
const genericRegex = /^https?:\/\/.+\..+/i;

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    githubUrl: "",
    liveUrl: "",
    category: "",
  });

  const [techStack, setTechStack] = useState<string[]>([]);
  const [currentTech, setCurrentTech] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [open, setOpen] = useState(false);

  /* ---------- touched flags ---------- */
  const [touched, setTouched] = useState({
    imageUrl: false,
    githubUrl: false,
    liveUrl: false,
  });

  const touch = (k: keyof typeof touched) =>
    setTouched((prev) => ({ ...prev, [k]: true }));

  /* ---------- validation ---------- */
  const imageValid =
    !formData.imageUrl || imageRegex.test(formData.imageUrl.trim());
  const githubValid =
    !formData.githubUrl || genericRegex.test(formData.githubUrl.trim());
  const liveValid =
    !formData.liveUrl || genericRegex.test(formData.liveUrl.trim());

  /* ---------- handlers ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur =
    (k: keyof typeof touched) => (e: FocusEvent<HTMLInputElement>) => {
      touch(k);
      setFormData((prev) => ({
        ...prev,
        [k]: e.target.value.trim(),
      }));
    };

  const addTech = () => {
    const t = currentTech.trim();
    if (t && !techStack.includes(t)) {
      setTechStack((prev) => [...prev, t]);
      setCurrentTech("");
    }
  };

  const handleTechKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addTech();
    }
  };

  const removeTech = (idx: number) =>
    setTechStack((prev) => prev.filter((_, i) => i !== idx));

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setFiles(files);
    setIsUploading(true);

    try {
      const file = files[0];
      const imageUrl = await uploadImageToCloudinary(file, "projects");

      if (imageUrl) {
        setUploadedImageUrl(imageUrl);
        setFormData((prev) => ({ ...prev, imageUrl }));
        // Mark as touched and valid since we got a valid URL from Cloudinary
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
      const res = await addProject(formData, techStack);
      if (res?.success) {
        toast.success(`${res.data} created successfully!`);
        showConfetti();
        setOpen(false);
        setFormData({
          title: "",
          description: "",
          imageUrl: "",
          githubUrl: "",
          liveUrl: "",
          category: "",
        });
        setTechStack([]);
        setFiles([]);
        setUploadedImageUrl("");
        setTouched({ imageUrl: false, githubUrl: false, liveUrl: false });
      } else {
        toast.error("Could not create project");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- ready to submit? ---------- */
  const canSubmit =
    formData.title &&
    formData.description &&
    formData.category &&
    techStack.length > 0 &&
    formData.imageUrl && // Ensure image URL is present
    githubValid &&
    liveValid &&
    !isUploading; // Don't allow submission while uploading

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center justify-center">
        <PlusIcon className="size-4 cursor-pointer" />
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] xl:min-w-[70rem] overflow-y-auto no-scrollbar bg-neutral-100 dark:bg-neutral-900">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Provide the details to add a new project. Convert first project
            image in this link{" "}
            <Link
              href="https://postimages.org/"
              target="_blank"
              className="text-primary hover:underline"
            >
              PostImage
            </Link>{" "}
            or{" "}
            <Link
              href="https://imgbb.com/"
              target="_blank"
              className="text-primary hover:underline"
            >
              IMGBB
            </Link>
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Project Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Enter project title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your project"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {/* Project Image */}
          <div className="space-y-1">
            <label htmlFor="imageUrl" className="text-sm font-medium">
              Project Image
            </label>
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
                    alt="Project preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            {touched.imageUrl && !imageValid && (
              <p className="text-xs text-destructive">
                Must be a valid file ending in .png, .jpg, .jpeg
              </p>
            )}
          </div>

          {/* GitHub & Live URLs */}
          <div className="flex items-center gap-2 w-full">
            <div className="space-y-1 w-full">
              <label htmlFor="githubUrl" className="text-sm font-medium">
                GitHub URL
              </label>
              <Input
                id="githubUrl"
                name="githubUrl"
                placeholder="https://github.com/..."
                value={formData.githubUrl}
                onChange={handleChange}
                onBlur={handleBlur("githubUrl")}
                className={cn(
                  touched.githubUrl &&
                    !githubValid &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              />
              {touched.githubUrl && !githubValid && (
                <p className="text-xs text-destructive">Invalid URL</p>
              )}
            </div>

            <div className="space-y-1 w-full">
              <label htmlFor="liveUrl" className="text-sm font-medium">
                Live URL
              </label>
              <Input
                id="liveUrl"
                name="liveUrl"
                placeholder="https://example.com"
                value={formData.liveUrl}
                onChange={handleChange}
                onBlur={handleBlur("liveUrl")}
                className={cn(
                  touched.liveUrl &&
                    !liveValid &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              />
              {touched.liveUrl && !liveValid && (
                <p className="text-xs text-destructive">Invalid URL</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2 w-full">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={(v) =>
                setFormData((prev) => ({ ...prev, category: v }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select project category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="software">Software Development</SelectItem>
                <SelectItem value="virtual">Virtual Assistance</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <label htmlFor="techStack" className="text-sm font-medium">
              Tech Stack
            </label>
            <div className="flex gap-2">
              <Input
                id="techStack"
                placeholder="Add technologies (press comma or enter)"
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyDown={handleTechKey}
              />
              <Button onClick={addTech} type="button">
                Add
              </Button>
            </div>
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {techStack.map((tech, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 bg-accent px-2 py-1 rounded-md"
                  >
                    <span className="text-sm">{tech}</span>
                    <button
                      onClick={() => removeTech(i)}
                      className="hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={
              !formData.title ||
              !formData.description ||
              !formData.category ||
              techStack.length === 0 ||
              !formData.imageUrl ||
              isSubmitting ||
              isUploading ||
              !canSubmit
            }
          >
            {isSubmitting ? (
              <LoaderCircleIcon className="size-5 animate-spin" />
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProject;
