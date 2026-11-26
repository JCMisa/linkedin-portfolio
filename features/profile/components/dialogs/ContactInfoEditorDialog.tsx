"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { contactInfoSchema, type ContactInfoInput } from "../../schemas";

interface ContactInfoEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: ContactInfoInput;
  /** Should throw on failure; the dialog shows the error and stays open. */
  onSave: (data: ContactInfoInput) => Promise<void>;
}

type FieldName = keyof ContactInfoInput;

const SECTIONS: {
  title: string;
  fields: {
    name: FieldName;
    label: string;
    placeholder: string;
    type?: string;
  }[];
}[] = [
  {
    title: "Address",
    fields: [
      { name: "city", label: "City", placeholder: "e.g. San Pablo City" },
      { name: "province", label: "Province", placeholder: "e.g. Laguna" },
      { name: "country", label: "Country", placeholder: "e.g. Philippines" },
    ],
  },
  {
    title: "Contact",
    fields: [
      {
        name: "email",
        label: "Email",
        placeholder: "email@example.com",
        type: "email",
      },
      {
        name: "contactNumber",
        label: "Phone",
        placeholder: "+63 9xx xxx xxxx",
        type: "tel",
      },
    ],
  },
  {
    title: "Links",
    fields: [
      {
        name: "portfolioLink",
        label: "Portfolio",
        placeholder: "https://yourportfolio.com",
      },
      {
        name: "linkedinLink",
        label: "LinkedIn",
        placeholder: "https://linkedin.com/in/username",
      },
      {
        name: "githubLink",
        label: "GitHub",
        placeholder: "https://github.com/username",
      },
      {
        name: "facebookLink",
        label: "Facebook",
        placeholder: "https://facebook.com/username",
      },
      {
        name: "instagramLink",
        label: "Instagram",
        placeholder: "https://instagram.com/username",
      },
      {
        name: "xLink",
        label: "X (Twitter)",
        placeholder: "https://x.com/username",
      },
    ],
  },
];

const ContactInfoEditorDialog = ({
  open,
  onOpenChange,
  values,
  onSave,
}: ContactInfoEditorDialogProps) => {
  const form = useForm<ContactInfoInput>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: values,
  });

  useEffect(() => {
    if (open) form.reset(values);
  }, [open, values, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await onSave(data);
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
        title="Edit contact info"
        description="How visitors can reach you."
        onSubmit={onSubmit}
        isSubmitting={form.formState.isSubmitting}
        className="sm:max-w-2xl"
      >
        {SECTIONS.map((section) => (
          <fieldset key={section.title} className="flex flex-col gap-3">
            <legend className="mb-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
              {section.title}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {section.fields.map(({ name, label, placeholder, type }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input
                          type={type}
                          placeholder={placeholder}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </fieldset>
        ))}
      </EditorDialog>
    </Form>
  );
};

export default ContactInfoEditorDialog;
