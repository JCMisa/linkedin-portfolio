import { z } from "zod";

export const certificateInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(2000),
  imageUrl: z.url({ message: "Upload a certificate image" }),
  acquiredDate: z.coerce.date({ message: "Pick the date you earned it" }),
});
export type CertificateInput = z.input<typeof certificateInputSchema>;

export const updateCertificateSchema = certificateInputSchema.extend({
  id: z.uuid(),
});

export const certificateIdSchema = z.object({ certificateId: z.uuid() });
