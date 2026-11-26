"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { EditorDialog } from "@/components/forms/EditorDialog";
import { Form } from "@/components/ui/form";
import { experienceSchema, type ExperienceInput } from "../../schemas";
import { ExperienceFields } from "./ExperienceFields";

type ExperienceOutput = z.output<typeof experienceSchema>;

interface SingleExperienceEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: ExperienceInput;
  /** Should throw on failure; the dialog shows the error and stays open. */
  onSave: (experience: ExperienceOutput) => Promise<void>;
  title?: string;
}

/** Add or edit one work experience. */
export const SingleExperienceEditorDialog = ({
  open,
  onOpenChange,
  experience,
  onSave,
  title = "Edit experience",
}: SingleExperienceEditorDialogProps) => {
  const [uploading, setUploading] = useState(false);
  const form = useForm<ExperienceInput, unknown, ExperienceOutput>({
    resolver: zodResolver(experienceSchema),
    defaultValues: experience,
  });

  useEffect(() => {
    if (open) form.reset(experience);
  }, [open, experience, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await onSave({ ...values, updatedAt: new Date() });
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    }
  });

  return (
    <Form {...form}>
      <EditorDialog
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description="Leave the end date empty if this is your current role."
        onSubmit={onSubmit}
        isSubmitting={form.formState.isSubmitting}
        submitDisabled={uploading}
        className="sm:max-w-2xl"
      >
        <ExperienceFields
          control={form.control}
          onUploadingChange={setUploading}
        />
      </EditorDialog>
    </Form>
  );
};
