import { z } from "zod";

export const transcriptMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().max(5000),
});

/** POST /api/process-inquiry body. */
export const processInquirySchema = z.object({
  messages: z
    .array(transcriptMessageSchema)
    .min(1, "No conversation data found")
    .max(500),
});

/** What Gemini must extract from a call transcript (structured output). */
export const extractedInquirySchema = z.object({
  visitorName: z.string().describe("The visitor's full name"),
  email: z.string().nullable().describe("Email address, or null if not given"),
  phoneNumber: z
    .string()
    .nullable()
    .describe("Phone number, or null if not given"),
  purpose: z
    .string()
    .describe('3-5 word category, e.g. "Web Development Inquiry", "Job Offer"'),
  summary: z.string().describe("2-3 sentence summary of the conversation"),
});

/** Visitor edits to the AI-extracted inquiry before submitting. */
export const updateInquirySchema = z.object({
  id: z.uuid(),
  visitorName: z.string().trim().min(1, "Name is required").max(150),
  email: z.union([z.email("Enter a valid email"), z.literal("")]).nullable(),
  phoneNumber: z.string().trim().max(30).nullable(),
  purpose: z.string().trim().min(1, "Purpose is required").max(150),
  summary: z.string().trim().min(1, "Summary is required").max(3000),
});
export type UpdateInquiryInput = z.input<typeof updateInquirySchema>;
