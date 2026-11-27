import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { and, eq, gt, sql } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { ContactInquiries, Users } from "@/db/schema";
import {
  extractedInquirySchema,
  processInquirySchema,
} from "@/features/contact/schemas";
import { getSessionUser } from "@/lib/auth";
import { checkLimit, rateLimitHeaders } from "@/lib/rate-limit";

/**
 * POST /api/process-inquiry
 * Turns a voice-call transcript into a structured inquiry, saves it for the
 * signed-in user and spends one contact credit.
 */
export async function POST(req: NextRequest) {
  // 1. Identify the caller from the session — never trust ids from the body
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validate the transcript
  const parsed = processInquirySchema.safeParse(
    await req.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }
  const { messages } = parsed.data;

  // 3. Check credits before spending tokens on Gemini
  if (user.remainingContactReq <= 0) {
    return NextResponse.json(
      { error: "Insufficient contact credits" },
      { status: 403 },
    );
  }

  // 4. Cap bursts: parallel calls could each reach Gemini before a credit is spent
  const limit = await checkLimit("inquiry", user.userId); // Clerk id, same key space as chat
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Too many requests. Please wait ${limit.retryAfterSec}s and try again.`,
        retryAfterSeconds: limit.retryAfterSec,
      },
      { status: 429, headers: rateLimitHeaders(limit) },
    );
  }

  try {
    // 5. Structured extraction — the SDK validates the output against the schema
    const { output } = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({ schema: extractedInquirySchema }),
      temperature: 0.2,
      system:
        "You are the secretary for a software developer's portfolio. " +
        "Extract contact details from a call transcript between the AI " +
        "assistant (JCM) and a visitor. Only use facts stated in the transcript.",
      prompt:
        `If the visitor never states their name, use "${user.name}".\n\n` +
        `TRANSCRIPT (JSON):\n${JSON.stringify(messages)}`,
    });

    // 6. Spend a credit atomically; bail out if another request used the last one
    const [spent] = await db
      .update(Users)
      .set({ remainingContactReq: sql`${Users.remainingContactReq} - 1` })
      .where(and(eq(Users.id, user.id), gt(Users.remainingContactReq, 0)))
      .returning({ id: Users.id });
    if (!spent) {
      return NextResponse.json(
        { error: "Insufficient contact credits" },
        { status: 403 },
      );
    }

    // 7. Save the inquiry, owned by this user
    const [saved] = await db
      .insert(ContactInquiries)
      .values({ ...output, userId: user.id, rawTranscript: messages })
      .returning();

    return NextResponse.json(saved);
  } catch (error) {
    console.error("[process-inquiry]", error);
    return NextResponse.json(
      { error: "AI processing failed. Please try again." },
      { status: 500 },
    );
  }
}
