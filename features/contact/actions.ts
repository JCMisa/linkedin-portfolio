"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { ContactInquiries } from "@/db/schema";
import { ActionError } from "@/lib/errors";
import { authActionClient } from "@/lib/safe-action";
import { updateInquirySchema } from "./schemas";

/** A visitor may only edit an inquiry they created themselves. */
export const updateInquiry = authActionClient
  .inputSchema(updateInquirySchema)
  .action(async ({ parsedInput: { id, email, ...fields }, ctx: { user } }) => {
    const [row] = await db
      .update(ContactInquiries)
      .set({ ...fields, email: email || null })
      .where(
        and(eq(ContactInquiries.id, id), eq(ContactInquiries.userId, user.id)),
      )
      .returning({ id: ContactInquiries.id });

    if (!row) throw new ActionError("Inquiry not found.");
    return row;
  });
