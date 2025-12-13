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
import { EditIcon, LoaderCircleIcon, X, AlertCircle } from "lucide-react";
import { Separator } from "../ui/separator";
import { useState, KeyboardEvent, useEffect, FocusEvent, useRef } from "react";
import { toast } from "sonner";
import { updateProject } from "@/lib/actions/projects";
import { showConfetti } from "@/lib/utils";
import { cn } from "@/lib/utils"; // shadcn helper
import { FileUpload } from "../ui/file-upload";
import { uploadImageToCloudinary } from "@/lib/actions/cloudinary";
import Image from "next/image";

/* ---------- validation helpers ---------- */
const imageRegex = /^https?:\/\/.+\.(png|jpe?g)$/i;
const genericRegex = /^https?:\/\/.+\..+/i; // basic URL

const EditProject = ({ project }: { project: ProjectType }) => {
  /* ---------- form state ---------- */
  const [formData, setFormData] = useState({
    title: project.title || "",
    description: project.description || "",
    imageUrl: project.image || "",
    githubUrl: project.githubLink || "",
    liveUrl: project.liveLink || "",
    category: project.category || "",
  });

  const [techStack, setTechStack] = useState<string[]>(
    project.techStacks || []
  );
  const [currentTech, setCurrentTech] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------- touched flags ---------- */
  const [touched, setTouched] = useState({
    imageUrl: false,
    githubUrl: false,
    liveUrl: false,
  });

  const touch = (field: keyof typeof touched) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  /* ---------- validation ---------- */
  // For Cloudinary URLs, we accept any valid URL (not just image extensions)
  // Cloudinary URLs don't always have file extensions
  const imageValid =
    !formData.imageUrl ||
    formData.imageUrl.trim().startsWith("http") ||
    imageRegex.test(formData.imageUrl.trim());
  const githubValid =
    !formData.githubUrl || genericRegex.test(formData.githubUrl.trim());
  const liveValid =
    !formData.liveUrl || genericRegex.test(formData.liveUrl.trim());

  /* ---------- misc ---------- */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  /* ---------- reset form when dialog re-opens for this project ---------- */
  useEffect(() => {
    if (!open) return;
    setFormData({
      title: project.title || "",
      description: project.description || "",
      imageUrl: project.image || "",
      githubUrl: project.githubLink || "",
      liveUrl: project.liveLink || "",
      category: project.category || "",
    });
    setTechStack(project.techStacks || []);
    setFiles([]);
    setUploadedImageUrl("");
    setTouched({ imageUrl: false, githubUrl: false, liveUrl: false });
  }, [open, project]);

  /* ---------- field handlers ---------- */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur =
    (field: keyof typeof touched) => (e: FocusEvent<HTMLInputElement>) => {
      touch(field);
      // trim on blur
      setFormData((prev) => ({ ...prev, [field]: e.target.value.trim() }));
    };

  /* ---------- tech-stack helpers ---------- */
  const handleAddTech = () => {
    const trimmed = currentTech.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack((prev) => [...prev, trimmed]);
      setCurrentTech("");
    }
  };

  const handleTechKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      handleAddTech();
    }
  };

  const handleRemoveTech = (indexToRemove: number) => {
    setTechStack((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

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

  /* ---------- submit ---------- */
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await updateProject(project.id, formData, techStack);
      if (result.success) {
        showConfetti();
        toast.success(`${result.data} updated successfully!`);
        setOpen(false);
      } else {
        toast.error(result.error || "Failed to update project");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasRealChanges =
    formData.title !== project.title ||
    formData.description !== project.description ||
    formData.imageUrl !== project.image ||
    formData.githubUrl !== project.githubLink ||
    formData.liveUrl !== project.liveLink ||
    formData.category !== project.category ||
    JSON.stringify(techStack) !== JSON.stringify(project.techStacks || []);

  const canSubmit =
    formData.title &&
    formData.description &&
    formData.category &&
    techStack.length > 0 &&
    formData.imageUrl &&
    imageValid &&
    githubValid &&
    liveValid &&
    hasRealChanges &&
    !isUploading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center">
          <EditIcon className="size-3 cursor-pointer hover:text-primary transition-colors" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update the details for {project.title}
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Title</label>
            <Input
              name="title"
              placeholder="Enter project title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              placeholder="Describe your project"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          {/* Project Image */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Project Image</label>

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
                    alt="Current project image"
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
                    alt="New project image preview"
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

          {/* GitHub & Live URLs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">GitHub URL</label>
              <Input
                name="githubUrl"
                placeholder="https://github.com/..."
                value={formData.githubUrl}
                onChange={handleInputChange}
                onBlur={handleBlur("githubUrl")}
                className={cn(
                  touched.githubUrl && !githubValid && "border-destructive"
                )}
              />
              {touched.githubUrl && !githubValid && (
                <p className="text-xs text-destructive">Invalid URL</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Live URL</label>
              <Input
                name="liveUrl"
                placeholder="https://example.com"
                value={formData.liveUrl}
                onChange={handleInputChange}
                onBlur={handleBlur("liveUrl")}
                className={cn(
                  touched.liveUrl && !liveValid && "border-destructive"
                )}
              />
              {touched.liveUrl && !liveValid && (
                <p className="text-xs text-destructive">Invalid URL</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={formData.category}
              onValueChange={(v) =>
                setFormData((prev) => ({ ...prev, category: v }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
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
            <label className="text-sm font-medium">Tech Stack</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add technology"
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyDown={handleTechKeyDown}
              />
              <Button onClick={handleAddTech} size="sm">
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
                    <button onClick={() => handleRemoveTech(i)}>
                      <X className="size-3 hover:text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={!canSubmit || isSubmitting || isUploading}
            >
              {isSubmitting ? (
                <LoaderCircleIcon className="size-5 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProject;
