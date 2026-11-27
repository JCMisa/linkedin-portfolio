"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";

interface TextFieldEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  label: string;
  placeholder?: string;
  value: string;
  maxLength: number;
  multiline?: boolean;
  /** Should throw on failure; the dialog shows the error and stays open. */
  onSave: (value: string) => Promise<void>;
}

/** Edits a single required text value (name, industry role, about, ...). */
export function TextFieldEditorDialog({
  open,
  onOpenChange,
  title,
  description,
  label,
  placeholder,
  value,
  maxLength,
  multiline = false,
  onSave,
}: TextFieldEditorDialogProps) {
  const schema = z.object({
    value: z
      .string()
      .trim()
      .min(1, `${label} is required`)
      .max(maxLength, `${label} must be ${maxLength} characters or fewer`),
  });

  const form = useForm<z.input<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { value },
  });

  // Start from the current value every time the dialog opens
  useEffect(() => {
    if (open) form.reset({ value });
  }, [open, value, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await onSave(values.value);
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
        description={description}
        onSubmit={onSubmit}
        isSubmitting={form.formState.isSubmitting}
        className={multiline ? "sm:max-w-2xl" : undefined}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                {multiline ? (
                  <Textarea rows={10} placeholder={placeholder} {...field} />
                ) : (
                  <Input placeholder={placeholder} {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorDialog>
    </Form>
  );
}
