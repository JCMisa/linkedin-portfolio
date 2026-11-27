"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { EditorDialog } from "@/components/forms/EditorDialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resumeSchema } from "../../schemas";

type ResumeInput = z.input<typeof resumeSchema>;

interface ResumeEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentITResumeLink: string;
  currentVAResumeLink: string;
  /** Should throw on failure; the dialog shows the error and stays open. */
  onSave: (itResumeLink: string, vaResumeLink: string) => Promise<void>;
}

const FIELDS = [
  { name: "itResumeLink", label: "IT resume link" },
  { name: "vaResumeLink", label: "Virtual assistant resume link" },
] as const;

const ResumeEditorDialog = ({
  open,
  onOpenChange,
  currentITResumeLink,
  currentVAResumeLink,
  onSave,
}: ResumeEditorDialogProps) => {
  const form = useForm<ResumeInput>({ resolver: zodResolver(resumeSchema) });

  useEffect(() => {
    if (open) {
      form.reset({
        itResumeLink: currentITResumeLink,
        vaResumeLink: currentVAResumeLink,
      });
    }
  }, [open, currentITResumeLink, currentVAResumeLink, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await onSave(values.itResumeLink, values.vaResumeLink);
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
        title="Edit resumes"
        description="Links to the resumes visitors can download."
        onSubmit={onSubmit}
        isSubmitting={form.formState.isSubmitting}
      >
        {FIELDS.map(({ name, label }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input placeholder="/Resume.pdf or https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </EditorDialog>
    </Form>
  );
};

export default ResumeEditorDialog;
