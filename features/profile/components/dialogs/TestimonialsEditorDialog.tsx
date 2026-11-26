"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { EditIconButton } from "@/components/forms/EditIconButton";
import { EditorDialog } from "@/components/forms/EditorDialog";
import { ImageUploadField } from "@/components/forms/ImageUploadField";
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
import { updateTopVoices } from "../../actions";
import { testimonialsSchema } from "../../schemas";

type TestimonialsInput = z.input<typeof testimonialsSchema>;
type Testimonial = TestimonialsInput["topVoices"][number];

const newTestimonial = (): Testimonial => ({
  id: crypto.randomUUID(),
  name: "",
  company: "",
  comment: "",
  profileImg: "",
  createdAt: new Date(),
  updatedAt: new Date(),
});

/** Edit the "Top Voices" testimonials (owner only). */
const TestimonialsEditorDialog = ({
  currentTestimonials,
}: {
  currentTestimonials: Testimonial[];
}) => {
  const [open, setOpen] = useState(false);
  const [uploads, setUploads] = useState(0); // in-flight image uploads
  const form = useForm<TestimonialsInput>({
    resolver: zodResolver(testimonialsSchema),
    defaultValues: { topVoices: currentTestimonials },
  });
  const voices = useFieldArray({
    control: form.control,
    name: "topVoices",
    keyName: "key",
  });

  const onOpenChange = (next: boolean) => {
    if (next) form.reset({ topVoices: currentTestimonials });
    setOpen(next);
  };

  const onSubmit = form.handleSubmit(async ({ topVoices }) => {
    const now = new Date();
    const result = await updateTopVoices({
      topVoices: topVoices.map((v) => ({ ...v, updatedAt: now })),
    });
    const error = applyActionResult(form, result);
    if (error) return void toast.error(error);
    toast.success("Testimonials updated");
    showConfetti();
    setOpen(false);
  });

  return (
    <Form {...form}>
      <EditorDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Edit top voices"
        description="Testimonials and praise from your network."
        trigger={<EditIconButton label="Edit testimonials" />}
        onSubmit={onSubmit}
        isSubmitting={form.formState.isSubmitting}
        submitDisabled={uploads > 0}
        className="sm:max-w-2xl"
      >
        {voices.fields.map((voice, index) => (
          <fieldset
            key={voice.key}
            className="flex flex-col gap-3 rounded-lg border p-4"
          >
            <div className="flex items-center justify-between">
              <legend className="text-sm font-semibold">
                Testimonial {index + 1}
              </legend>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => voices.remove(index)}
                aria-label={`Remove testimonial ${index + 1}`}
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name={`topVoices.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`topVoices.${index}.company`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title / company</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. CEO at Acme" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`topVoices.${index}.comment`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Testimonial</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="What did they say?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`topVoices.${index}.profileImg`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <ImageUploadField
                    value={field.value}
                    onChange={(url) => field.onChange(url ?? "")}
                    folder="jcm/testimonials"
                    onUploadingChange={(busy) =>
                      setUploads((n) => n + (busy ? 1 : -1))
                    }
                    allowClear
                    previewClassName="size-24 rounded-full"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => voices.append(newTestimonial())}
        >
          <PlusIcon className="size-4" /> Add testimonial
        </Button>
      </EditorDialog>
    </Form>
  );
};

export default TestimonialsEditorDialog;
