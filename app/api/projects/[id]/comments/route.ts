import { NextResponse } from "next/server";
import { z } from "zod";
import { getProjectComments } from "@/features/projects/queries";

/** GET /api/projects/:id/comments — newest first. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }
  return NextResponse.json(await getProjectComments(id));
}
