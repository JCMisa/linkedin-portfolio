"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { EditIconButton } from "@/components/forms/EditIconButton";
import { EditorDialog } from "@/components/forms/EditorDialog";
import { TagInput } from "@/components/forms/TagInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { applyActionResult } from "@/lib/form-errors";
import { showConfetti } from "@/lib/confetti";
import { updateServices } from "../../actions";
import { servicesSchema } from "../../schemas";

type ServicesInput = z.input<typeof servicesSchema>;

/** Edit the list of services offered (owner only). */
const ServicesEditorDialog = ({
  currentServices,
}: {
  currentServices: string[];
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm<ServicesInput>({
    resolver: zodResolver(servicesSchema),
    defaultValues: { services: currentServices },
  });

  const onOpenChange = (next: boolean) => {
    if (next) form.reset({ services: currentServices });
    setOpen(next);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const error = applyActionResult(form, await updateServices(values));
    if (error) return void toast.error(error);
    toast.success("Services updated");
    showConfetti();
    setOpen(false);
  });

  return (
    <Form {...form}>
      <EditorDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Edit services"
        description="The services you offer to clients."
        trigger={<EditIconButton label="Edit services" />}
        onSubmit={onSubmit}
        isSubmitting={form.formState.isSubmitting}
      >
        <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Services</FormLabel>
              <FormControl>
                <TagInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="e.g. Web Development (Enter to add)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorDialog>
    </Form>
  );
};

export default ServicesEditorDialog;
