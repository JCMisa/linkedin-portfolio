"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { EditorDialog } from "@/components/forms/EditorDialog";
import { ImageUploadField } from "@/components/forms/ImageUploadField";
import { TagInput } from "@/components/forms/TagInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { applyActionResult } from "@/lib/form-errors";
import { showConfetti } from "@/lib/utils";
import { addProject, updateProject } from "../actions/projects";
import {
  PROJECT_CATEGORIES,
  projectInputSchema,
  type ProjectCategory,
  type ProjectInput,
} from "../schemas";

type ProjectOutput = z.output<typeof projectInputSchema>;

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  software: "Software Development",
  virtual: "Virtual Assistance",
  others: "Others",
};

const toFormValues = (project?: ProjectType): ProjectInput => ({
  title: project?.title ?? "",
  description: project?.description ?? "",
  imageUrl: project?.image ?? "",
  githubUrl: project?.githubLink ?? "",
  liveUrl: project?.liveLink ?? "",
  // Empty until chosen; zod reports "Select a category" on submit
  category: (project?.category ?? undefined) as ProjectCategory,
  techStacks: project?.techStacks ?? [],
});

/** Create a project (no `project` prop) or edit an existing one. */
export default function ProjectFormDialog({
  project,
}: {
  project?: ProjectType;
}) {
  const isEdit = !!project;
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm<ProjectInput, unknown, ProjectOutput>({
    resolver: zodResolver(projectInputSchema),
    defaultValues: toFormValues(project),
  });

  const onOpenChange = (next: boolean) => {
    if (next) form.reset(toFormValues(project)); // fresh values each time
    setOpen(next);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const result = isEdit
      ? await updateProject({ id: project.id, ...values })
      : await addProject(values);

    const error = applyActionResult(form, result);
    if (error) return void toast.error(error);

    toast.success(`${values.title} ${isEdit ? "updated" : "created"}!`);
    showConfetti();
    setOpen(false);
  });

  return (
    <Form {...form}>
      <EditorDialog
        open={open}
        onOpenChange={onOpenChange}
        title={isEdit ? "Edit project" : "Add new project"}
        description={
          isEdit
            ? `Update the details for ${project.title}.`
            : "Fill in the details to publish a new project."
        }
        trigger={
          <button
            type="button"
            className="flex items-center justify-center"
            aria-label={isEdit ? `Edit ${project.title}` : "Add project"}
          >
            {isEdit ? (
              <EditIcon className="size-3 cursor-pointer transition-colors hover:text-primary" />
            ) : (
              <PlusIcon className="size-4 cursor-pointer" />
            )}
          </button>
        }
        onSubmit={onSubmit}
        isSubmitting={form.formState.isSubmitting}
        submitDisabled={uploading}
        submitLabel={isEdit ? "Save changes" : "Create project"}
        className="sm:max-w-2xl"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Project title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="What did you build?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project image</FormLabel>
              <ImageUploadField
                value={field.value}
                onChange={(url) => field.onChange(url ?? "")}
                folder="projects"
                onUploadingChange={setUploading}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://github.com/..."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="liveUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PROJECT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="techStacks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tech stack</FormLabel>
              <FormControl>
                <TagInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Add a technology (Enter or comma)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorDialog>
    </Form>
  );
}
