import { NextResponse, type NextRequest } from "next/server";
import { getProjectsPage } from "@/features/projects/queries";
import { projectsQuerySchema } from "@/features/projects/schemas";
import { getSessionUser } from "@/lib/auth";

/** GET /api/projects?q&category&cursor&limit — paginated home feed. */
export async function GET(req: NextRequest) {
  const parsed = projectsQuerySchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const viewer = await getSessionUser();
  return NextResponse.json(
    await getProjectsPage(parsed.data, viewer?.id ?? null),
  );
}
