"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { EditIconButton } from "@/components/forms/EditIconButton";
import { EditorDialog } from "@/components/forms/EditorDialog";
import { TagInput } from "@/components/forms/TagInput";
import { Button } from "@/components/ui/button";
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
import { applyActionResult } from "@/lib/form-errors";
import { showConfetti } from "@/lib/confetti";
import { updateSkills } from "../../actions";
import { skillsSchema } from "../../schemas";

type SkillsInput = z.input<typeof skillsSchema>;
type SkillCategory = SkillsInput["skills"][number];

const newCategory = (): SkillCategory => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  items: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

/** Edit skill categories and their skills (owner only). */
const SkillsEditorDialog = ({
  currentSkills,
}: {
  currentSkills: SkillCategory[];
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm<SkillsInput>({
    resolver: zodResolver(skillsSchema),
    defaultValues: { skills: currentSkills },
  });
  const categories = useFieldArray({
    control: form.control,
    name: "skills",
    keyName: "key", // keep our own `id` field intact
  });

  const onOpenChange = (next: boolean) => {
    if (next) form.reset({ skills: currentSkills });
    setOpen(next);
  };

  const onSubmit = form.handleSubmit(async ({ skills }) => {
    const now = new Date();
    const result = await updateSkills({
      skills: skills.map((s) => ({ ...s, updatedAt: now })),
    });
    const error = applyActionResult(form, result);
    if (error) return void toast.error(error);
    toast.success("Skills updated");
    showConfetti();
    setOpen(false);
  });

  return (
    <Form {...form}>
      <EditorDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Edit skills & expertise"
        description="Group your skills into categories to make them easier to browse."
        trigger={<EditIconButton label="Edit skills" />}
        onSubmit={onSubmit}
        isSubmitting={form.formState.isSubmitting}
        className="sm:max-w-2xl"
      >
        {categories.fields.map((category, index) => (
          <fieldset
            key={category.key}
            className="flex flex-col gap-3 rounded-lg border p-4"
          >
            <div className="flex items-start gap-2">
              <FormField
                control={form.control}
                name={`skills.${index}.title`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Programming Languages"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-6 text-muted-foreground hover:text-destructive"
                onClick={() => categories.remove(index)}
                aria-label="Remove category"
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>

            <FormField
              control={form.control}
              name={`skills.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder="Optional summary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`skills.${index}.items`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Add a skill (Enter to add)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => categories.append(newCategory())}
        >
          <PlusIcon className="size-4" /> Add category
        </Button>
      </EditorDialog>
    </Form>
  );
};

export default SkillsEditorDialog;
