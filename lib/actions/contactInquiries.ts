"use server";

import { eq } from "drizzle-orm";
import { withErrorHandling } from "../utils";
import { getCurrentUser } from "./users";
import { ContactInquiries } from "@/config/schema";
import { db } from "@/config/db";
import { InquiryData } from "@/app/(routes)/contact/assistant/_components/InquiryReview";
import { revalidateTag, unstable_cache } from "next/cache";

export const getAllInquiries = unstable_cache(
  withErrorHandling(async () => {
    const data = await db.select().from(ContactInquiries);

    if (data.length > 0) {
      return { data: data ?? [], success: true };
    } else {
      return { data: null, success: false };
    }
  }),
  ["all-inquiries"], // Key parts (cache tag)
  {
    revalidate: 3600, // Cache for 1 hour (adjust as needed)
    tags: ["inquiries"], // Tag for manual revalidation later
  }
);

export const updateInquiry = withErrorHandling(
  async (updatedData: InquiryData) => {
    const user = await getCurrentUser();

    if (!user) {
      return { data: null, success: false };
    }

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
  }
);
