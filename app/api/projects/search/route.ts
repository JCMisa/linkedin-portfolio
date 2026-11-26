import { NextResponse, type NextRequest } from "next/server";
import { searchProjects } from "@/features/projects/queries";
import { projectsQuerySchema } from "@/features/projects/schemas";

/** GET /api/projects/search?q&category — all matching projects (grid view). */
export async function GET(req: NextRequest) {
  const parsed = projectsQuerySchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }
  return NextResponse.json(await searchProjects(parsed.data));
}
