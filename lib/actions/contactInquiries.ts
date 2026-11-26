"use server";

import { eq } from "drizzle-orm";
import { withErrorHandling } from "../utils";
import { ContactInquiries } from "@/config/schema";
import { db } from "@/config/db";
import { InquiryData } from "@/app/(routes)/contact/assistant/_components/InquiryReview";
import { revalidateTag } from "next/cache";
import { requireUser } from "@/lib/auth";

export const updateInquiry = withErrorHandling(
  async (updatedData: InquiryData) => {
    // TODO(v3 phase 4): add an owner column so users can only edit their own inquiry.
    await requireUser();

    const [data] = await db
      .update(ContactInquiries)
      .set({
        visitorName: updatedData.visitorName,
        email: updatedData.email,
        phoneNumber: updatedData.phoneNumber,
        purpose: updatedData.purpose,
        summary: updatedData.summary,
      })
      .where(eq(ContactInquiries.id, updatedData.id as string))
      .returning({ insertedInquiryId: ContactInquiries.id });

    if (data && data.insertedInquiryId) {
      revalidateTag("inquiries", "");
      return { data: data.insertedInquiryId, success: true };
    }
    return { data: null, success: false };
  },
);
