"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { DatePicker } from "@/components/forms/DatePicker";
import { EditorDialog } from "@/components/forms/EditorDialog";
import { ImageUploadField } from "@/components/forms/ImageUploadField";
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
import { addCertificate, updateCertificate } from "../actions";
import { certificateInputSchema, type CertificateInput } from "../schemas";

type CertificateOutput = z.output<typeof certificateInputSchema>;

const toFormValues = (cert?: CertificateType): CertificateInput => ({
  title: cert?.title ?? "",
  description: cert?.description ?? "",
  imageUrl: cert?.image ?? "",
  // Cached reads can return dates as ISO strings; normalize to Date
  acquiredDate: cert?.acquiredDate ? new Date(cert.acquiredDate) : new Date(),
});

/** Create a certificate (no `certificate` prop) or edit an existing one. */
export default function CertificateFormDialog({
  certificate,
}: {
  certificate?: CertificateType;
}) {
  const isEdit = !!certificate;
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm<CertificateInput, unknown, CertificateOutput>({
    resolver: zodResolver(certificateInputSchema),
    defaultValues: toFormValues(certificate),
  });

  const onOpenChange = (next: boolean) => {
    if (next) form.reset(toFormValues(certificate));
    setOpen(next);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const result = isEdit
      ? await updateCertificate({ id: certificate.id, ...values })
      : await addCertificate(values);

    const error = applyActionResult(form, result);
    if (error) return void toast.error(error);

    toast.success(`${values.title} ${isEdit ? "updated" : "added"}!`);
    showConfetti();
    setOpen(false);
  });

  return (
    <Form {...form}>
      <EditorDialog
        open={open}
        onOpenChange={onOpenChange}
        title={isEdit ? "Edit certificate" : "Add new certificate"}
        description={
          isEdit
            ? `Update the details for ${certificate.title}.`
            : "Fill in the details of your new certificate."
        }
        trigger={
          <button
            type="button"
            className="flex items-center justify-center"
            aria-label={
              isEdit ? `Edit ${certificate.title}` : "Add certificate"
            }
          >
            {isEdit ? (
              <EditIcon className="size-3 cursor-pointer hover:text-primary" />
            ) : (
              <PlusIcon className="size-4 cursor-pointer" />
            )}
          </button>
        }
        onSubmit={onSubmit}
        isSubmitting={form.formState.isSubmitting}
        submitDisabled={uploading}
        submitLabel={isEdit ? "Save changes" : "Add certificate"}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Certificate title" {...field} />
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
                <Textarea rows={3} placeholder="What is it for?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acquiredDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date acquired</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value as Date | undefined}
                  onChange={(date) => field.onChange(date ?? undefined)}
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
              <FormLabel>Certificate image</FormLabel>
              <ImageUploadField
                value={field.value}
                onChange={(url) => field.onChange(url ?? "")}
                folder="jcm"
                onUploadingChange={setUploading}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorDialog>
    </Form>
  );
}
