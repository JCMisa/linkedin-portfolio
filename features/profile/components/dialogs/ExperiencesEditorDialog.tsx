"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { EditorDialog } from "@/components/forms/EditorDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { experiencesSchema, type ExperienceInput } from "../../schemas";
import { ExperienceFields } from "./ExperienceFields";

type ExperiencesInput = z.input<typeof experiencesSchema>;
type ExperiencesOutput = z.output<typeof experiencesSchema>;

interface ExperiencesEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentExperiences: ExperienceInput[];
  /** Should throw on failure; the dialog shows the error and stays open. */
  onSave: (experiences: ExperiencesOutput["experiences"]) => Promise<void>;
}

const newExperience = (): ExperienceInput => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  bannerImg: "",
  dateFrom: "",
  dateTo: "",
  createdAt: new Date(),
  updatedAt: new Date(),
});

/** Edit the whole experience list at once (add, edit, remove). */
export const ExperiencesEditorDialog = ({
  open,
  onOpenChange,
  currentExperiences,
  onSave,
}: ExperiencesEditorDialogProps) => {
  const [uploads, setUploads] = useState(0);
  const form = useForm<ExperiencesInput, unknown, ExperiencesOutput>({
    resolver: zodResolver(experiencesSchema),
    defaultValues: { experiences: currentExperiences },
  });
  const list = useFieldArray({
    control: form.control,
    name: "experiences",
    keyName: "key",
  });

  useEffect(() => {
    if (open) form.reset({ experiences: currentExperiences });
  }, [open, currentExperiences, form]);

  const onSubmit = form.handleSubmit(async ({ experiences }) => {
    try {
      const now = new Date();
      await onSave(experiences.map((e) => ({ ...e, updatedAt: now })));
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
        title="Edit experiences"
        description="Leave the end date empty for your current role."
        onSubmit={onSubmit}
        isSubmitting={form.formState.isSubmitting}
        submitDisabled={uploads > 0}
        className="sm:max-w-2xl"
      >
        {list.fields.map((item, index) => (
          <fieldset
            key={item.key}
            className="flex flex-col gap-3 rounded-lg border p-4"
          >
            <div className="flex items-center justify-between">
              <legend className="text-sm font-semibold">
                Experience {index + 1}
              </legend>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => list.remove(index)}
                aria-label={`Remove experience ${index + 1}`}
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>
            <ExperienceFields
              control={form.control}
              prefix={`experiences.${index}.`}
              onUploadingChange={(busy) =>
                setUploads((n) => n + (busy ? 1 : -1))
              }
            />
          </fieldset>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => list.prepend(newExperience())}
        >
          <PlusIcon className="size-4" /> Add experience
        </Button>
      </EditorDialog>
    </Form>
  );
};
