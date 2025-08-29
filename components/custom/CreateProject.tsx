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
import { LoaderCircleIcon, PlusIcon, X } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { useState, KeyboardEvent } from "react";
import { toast } from "sonner";
import { addProject } from "@/lib/actions/projects";
import { showConfetti } from "@/lib/utils";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTech = () => {
    if (currentTech.trim()) {
      setTechStack((prev) => [...prev, currentTech.trim()]);
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
    setTechStack((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    const projectData = {
      ...formData,
      techStack,
    };
    console.log("Project Data:", projectData);

    setIsSubmitting(true);
    try {
      const result = await addProject(projectData, techStack);
      if (result && result.data && result.success) {
        toast.success(`${result.data} added successfully!`);
        showConfetti();
        setTechStack([]);
        setFormData({
          title: "",
          description: "",
          imageUrl: "",
          githubUrl: "",
          liveUrl: "",
          category: "",
        });
      }
    } catch (error) {
      console.log("Error creating project:", error);
      toast.error("Error creating project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="flex items-center justify-center">
        <PlusIcon className="size-4 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Provide the details to add a new project. Convert first project
            image in this link{" "}
            <Link
              href={"https://postimages.org/"}
              target="_blank"
              className="text-primary hover:underline transition-all ease-in-out duration-200"
            >
              PostImage
            </Link>{" "}
            or here{" "}
            <Link
              href={"https://imgbb.com/"}
              target="_blank"
              className="text-primary hover:underline transition-all ease-in-out duration-200"
            >
              IMGBB
            </Link>
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {/* create project form */}
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Project Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Enter project title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your project"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-medium">
              Image URL
            </label>
            <Input
              id="imageUrl"
              name="imageUrl"
              placeholder="Enter image URL"
              value={formData.imageUrl}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center gap-2 w-full">
            <div className="space-y-2 w-full">
              <label htmlFor="githubUrl" className="text-sm font-medium">
                GitHub URL
              </label>
              <Input
                id="githubUrl"
                name="githubUrl"
                placeholder="Enter GitHub repository URL"
                value={formData.githubUrl}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2 w-full">
              <label htmlFor="liveUrl" className="text-sm font-medium">
                Live URL
              </label>
              <Input
                id="liveUrl"
                name="liveUrl"
                placeholder="Enter live project URL"
                value={formData.liveUrl}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2 w-full">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
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
                onKeyDown={handleTechKeyDown}
              />
              <Button onClick={handleAddTech} type="button">
                Add
              </Button>
            </div>
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-accent px-2 py-1 rounded-md"
                  >
                    <span className="text-sm">{tech}</span>
                    <button
                      onClick={() => handleRemoveTech(index)}
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
              !formData.imageUrl ||
              !formData.category ||
              techStack.length === 0 ||
              isSubmitting
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
