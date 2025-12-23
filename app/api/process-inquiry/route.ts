import { db } from "@/config/db";
import { ContactInquiries } from "@/config/schema";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, userName } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No conversation data found" },
        { status: 400 }
      );
    }

    // 1. Generate Structured Data with Gemini
    const { text: aiResponse } = await generateText({
      model: google("gemini-2.5-flash-lite"),
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
      temperature: 0.2, // Low temperature for factual extraction
    });

    // 2. Parse JSON safely
    let structuredData;
    try {
      const cleanJson = aiResponse.replace(/```json\n?|```/g, "").trim();
      structuredData = JSON.parse(cleanJson);
    } catch (e) {
      console.error("JSON Parse Error:", aiResponse);
      return NextResponse.json(
        { error: "AI processing failed" },
        { status: 500 }
      );
    }

    // 3. Save to NeonDB
    const [savedRecord] = await db
      .insert(ContactInquiries)
      .values({
        visitorName: structuredData.visitorName,
        email: structuredData.email,
        phoneNumber: structuredData.phoneNumber,
        purpose: structuredData.purpose,
        summary: structuredData.summary,
        rawTranscript: messages,
      })
      .returning();

    return NextResponse.json(savedRecord, { status: 200 });
  } catch (error) {
    console.error("Process Inquiry Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
