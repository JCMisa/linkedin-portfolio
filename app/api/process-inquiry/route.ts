// app/api/process-inquiry/route.ts

import { db } from "@/config/db";
import { ContactInquiries, Users } from "@/config/schema";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { eq, sql } from "drizzle-orm"; // We need 'sql' for the atomic decrement logic
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // ---------------------------------------------------------
    // 1. INPUT VALIDATION
    // ---------------------------------------------------------
    const { messages, userName, userId } = await req.json();

    // Ensure we have a conversation history to process
    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No conversation data found" },
        { status: 400 }
      );
    }

    // Ensure we know WHO is making the request (for credit tracking)
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // ---------------------------------------------------------
    // 2. CREDIT CHECK (READ OPERATION)
    // ---------------------------------------------------------
    // We check the user's balance BEFORE calling Gemini to save costs.
    const userCheck = await db
      .select({ credits: Users.remainingContactReq })
      .from(Users)
      .where(eq(Users.userId, userId))
      .limit(1);

    // If user doesn't exist or has 0 credits, stop here.
    if (!userCheck.length || userCheck[0].credits <= 0) {
      return NextResponse.json(
        { error: "Insufficient contact credits" },
        { status: 403 } // 403 Forbidden is standard for "quota exceeded"
      );
    }

    // ---------------------------------------------------------
    // 3. AI EXTRACTION (GEMINI)
    // ---------------------------------------------------------
    // We send the transcript to Gemini to get structured JSON data.
    const { text: aiResponse } = await generateText({
      model: google("gemini-2.5-flash"), // Fast, cost-effective model
      prompt: `
        You are an intelligent secretary for a Software Developer's portfolio. 
        Analyze the following transcript between the AI Assistant (JCM) and a visitor named "${userName}".

        TRANSCRIPT:
        ${JSON.stringify(messages, null, 2)}

        TASK:
        Extract the following information into a strict JSON object:
        1. visitorName: The visitor's full name. If not explicitly provided, use "${userName}".
        2. email: Extracted email address (or null if missing).
        3. phoneNumber: Extracted phone number (or null if missing).
        4. purpose: A short 3-5 word category of why they called (e.g., "Web Development Inquiry", "Job Offer", "General Greeting").
        5. summary: A concise paragraph (2-3 sentences) summarizing the conversation.

        OUTPUT FORMAT (JSON ONLY):
        {
          "visitorName": "string",
          "email": "string | null",
          "phoneNumber": "string | null",
          "purpose": "string",
          "summary": "string"
        }
      `,
      temperature: 0.2, // Low temperature ensures factual consistency
    });

    // ---------------------------------------------------------
    // 4. PARSE AI RESPONSE
    // ---------------------------------------------------------
    let structuredData;
    try {
      // Remove markdown code blocks if Gemini adds them (e.g., ```json ... ```)
      const cleanJson = aiResponse.replace(/```json\n?|```/g, "").trim();
      structuredData = JSON.parse(cleanJson);
    } catch (e) {
      console.error("JSON Parse Error:", aiResponse);
      return NextResponse.json(
        { error: "AI processing failed" },
        { status: 500 }
      );
    }

    // ---------------------------------------------------------
    // 5. DATABASE OPERATIONS (SEQUENTIAL)
    // ---------------------------------------------------------
    // Since your DB driver doesn't support transactions, we run these in order.
    // If Step 5A succeeds but 5B fails, the user gets a "free" record.
    // This is an acceptable trade-off for this specific feature.

    // A. INSERT THE INQUIRY (Write 1)
    const [savedRecord] = await db
      .insert(ContactInquiries)
      .values({
        visitorName: structuredData.visitorName,
        email: structuredData.email,
        phoneNumber: structuredData.phoneNumber,
        purpose: structuredData.purpose,
        summary: structuredData.summary,
        rawTranscript: messages, // Save raw chat for debugging/reference
        // status: "draft" // (Optional) Explicitly marks this as AI-generated
        // isReviewed: false // (Optional) Default is false in schema
      })
      .returning();

    // B. DECREMENT USER CREDITS (Write 2)
    // We use `sql` to perform an ATOMIC update. This prevents race conditions.
    // It says: "Set the new value to (current value - 1)" directly in the DB engine.
    await db
      .update(Users)
      .set({
        remainingContactReq: sql`${Users.remainingContactReq} - 1`,
      })
      .where(eq(Users.userId, userId));

    // ---------------------------------------------------------
    // 6. RETURN SUCCESS
    // ---------------------------------------------------------
    return NextResponse.json(savedRecord, { status: 200 });
  } catch (error) {
    console.error("Process Inquiry Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
