import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

/**
 * GET /api/users — the signed-in user's own DB record, or `null` when signed
 * out (or when the Clerk webhook hasn't created the row yet).
 */
export async function GET() {
  return NextResponse.json(await getSessionUser());
}
