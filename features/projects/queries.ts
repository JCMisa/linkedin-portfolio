import "server-only";
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  lt,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { db } from "@/db";
import { Comments, Likes, Projects, Users } from "@/db/schema";
import type { ProjectsQuery } from "./schemas";
import type { OptimizedProject } from "./types";

export const getLatestProjects = (limit: number) =>
  db.select().from(Projects).orderBy(desc(Projects.createdAt)).limit(limit);

export const getProjectById = async (projectId: string) => {
  const [project] = await db
    .select()
    .from(Projects)
    .where(eq(Projects.id, projectId))
    .limit(1);
  return project ?? null;
};

export const getLikeCount = async () => {
  const [row] = await db.select({ value: count() }).from(Likes);
  return row?.value ?? 0;
};

export const getCommentCount = async () => {
  const [row] = await db.select({ value: count() }).from(Comments);
  return row?.value ?? 0;
};

export const getProjectLikes = (projectId: string) =>
  db
    .select({
      userId: Users.id,
      userName: Users.name,
      userImage: Users.image,
      userRole: Users.role,
      likedAt: Likes.createdAt,
    })
    .from(Likes)
    .leftJoin(Users, eq(Likes.userId, Users.id))
    .where(eq(Likes.projectId, projectId))
    .orderBy(desc(Likes.createdAt));

export const getProjectComments = (projectId: string) =>
  db
    .select({
      id: Comments.id,
      content: Comments.content,
      createdAt: Comments.createdAt,
      user: {
        id: Users.id,
        name: Users.name,
        image: Users.image,
        role: Users.role,
      },
    })
    .from(Comments)
    .leftJoin(Users, eq(Comments.userId, Users.id))
    .where(eq(Comments.projectId, projectId))
    .orderBy(desc(Comments.createdAt));

function searchConditions({
  q,
  category,
}: Pick<ProjectsQuery, "q" | "category">) {
  const conditions: SQL[] = [];
  if (q) {
    const like = `%${q}%`;
    conditions.push(
      or(ilike(Projects.title, like), ilike(Projects.description, like))!,
    );
  }
  if (category) conditions.push(eq(Projects.category, category));
  return conditions;
}

/** All projects matching a search (used by the /projects grid). */
export const searchProjects = (params: Pick<ProjectsQuery, "q" | "category">) =>
  db
    .select()
    .from(Projects)
    .where(and(...searchConditions(params)))
    .orderBy(desc(Projects.createdAt));

/**
 * One page of the home feed with engagement data, in a single SQL query
 * (counts via grouped subqueries, hasLiked + latest commenter via correlated
 * subqueries — previously 2 extra queries per project).
 * Cursor format: "<createdAt ISO>|<id>".
 */
export async function getProjectsPage(
  { q, category, cursor, limit }: ProjectsQuery,
  viewerId: number | null,
): Promise<{ items: OptimizedProject[]; nextCursor: string | null }> {
  const likesSub = db
    .select({ projectId: Likes.projectId, n: count(Likes.id).as("l_count") })
    .from(Likes)
    .groupBy(Likes.projectId)
    .as("likes_sub");

  const commentsSub = db
    .select({
      projectId: Comments.projectId,
      n: count(Comments.id).as("c_count"),
    })
    .from(Comments)
    .groupBy(Comments.projectId)
    .as("comments_sub");

  const hasLiked = viewerId
    ? sql<boolean>`exists (select 1 from ${Likes} where ${Likes.projectId} = ${Projects.id} and ${Likes.userId} = ${viewerId})`
    : sql<boolean>`false`;

  const latestCommenter = sql<{ name: string; image: string | null } | null>`(
    select json_build_object('name', ${Users.name}, 'image', ${Users.image})
    from ${Comments} inner join ${Users} on ${Comments.userId} = ${Users.id}
    where ${Comments.projectId} = ${Projects.id}
    order by ${Comments.createdAt} desc
    limit 1
  )`;

  const conditions = searchConditions({ q, category });
  if (cursor) {
    const [ts, id] = cursor.split("|");
    const at = new Date(ts);
    if (!Number.isNaN(at.getTime()) && id) {
      conditions.push(
        or(
          lt(Projects.createdAt, at),
          and(eq(Projects.createdAt, at), lt(Projects.id, id)),
        )!,
      );
    }
  }

  const rows = await db
    .select({
      ...getTableColumns(Projects),
      likesCount: likesSub.n,
      commentsCount: commentsSub.n,
      hasLiked,
      latestCommenter,
    })
    .from(Projects)
    .leftJoin(likesSub, eq(Projects.id, likesSub.projectId))
    .leftJoin(commentsSub, eq(Projects.id, commentsSub.projectId))
    .where(and(...conditions))
    .orderBy(desc(Projects.createdAt), desc(Projects.id))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const items = rows.slice(0, limit).map((row) => ({
    ...row,
    likesCount: Number(row.likesCount ?? 0),
    commentsCount: Number(row.commentsCount ?? 0),
    hasLiked: Boolean(row.hasLiked),
    latestCommenter: row.latestCommenter ?? null,
  }));

  const last = items.at(-1);
  return {
    items,
    nextCursor:
      hasMore && last ? `${last.createdAt.toISOString()}|${last.id}` : null,
  };
}
