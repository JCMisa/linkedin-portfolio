"use client";

import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { ProjectsType } from "@/db/schema";
import { getActionError } from "@/lib/action-result";
import { fetchJson } from "@/lib/fetch-json";
import { createComment, deleteComment } from "./actions/comments";
import type { ProjectCategory } from "./schemas";
import type { OptimizedProject } from "./types";

type Filters = { q?: string; category?: ProjectCategory | null };
type FeedPage = { items: OptimizedProject[]; nextCursor: string | null };

export type ProjectComment = {
  id: string;
  content: string;
  createdAt: Date;
  user: { id: number; name: string; image: string | null; role: string } | null;
};

export const projectKeys = {
  all: ["projects"] as const,
  feed: (f: Filters) =>
    ["projects", "feed", f.q ?? "", f.category ?? null] as const,
  search: (f: Filters) =>
    ["projects", "search", f.q ?? "", f.category ?? null] as const,
  comments: (projectId: string) => ["projects", projectId, "comments"] as const,
};

/** JSON turns Dates into strings; restore the timestamp fields. */
function withDates<T extends { createdAt: unknown; updatedAt?: unknown }>(
  row: T,
): T {
  return {
    ...row,
    createdAt: new Date(row.createdAt as string),
    ...(row.updatedAt !== undefined && {
      updatedAt: new Date(row.updatedAt as string),
    }),
  };
}

function toSearchParams(f: Filters & { cursor?: string; limit?: number }) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.category) p.set("category", f.category);
  if (f.cursor) p.set("cursor", f.cursor);
  if (f.limit) p.set("limit", String(f.limit));
  return p.toString();
}

/**
 * Infinite home feed. The first page is rendered on the server and passed as
 * `initialPage` (used only for the unfiltered view).
 */
export function useProjectsFeed(
  filters: Filters,
  initialPage?: FeedPage,
  limit = 5,
) {
  const unfiltered = !filters.q && !filters.category;
  return useInfiniteQuery({
    queryKey: projectKeys.feed(filters),
    queryFn: async ({ pageParam }) => {
      const page = await fetchJson<FeedPage>(
        `/api/projects?${toSearchParams({ ...filters, cursor: pageParam, limit })}`,
      );
      return { ...page, items: page.items.map(withDates) };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialData:
      unfiltered && initialPage
        ? { pages: [initialPage], pageParams: [undefined] }
        : undefined,
    placeholderData: keepPreviousData,
  });
}

/** Every project matching the filters (the /projects grid). */
export function useProjectSearch(filters: Filters) {
  return useQuery({
    queryKey: projectKeys.search(filters),
    queryFn: async () =>
      (
        await fetchJson<ProjectsType[]>(
          `/api/projects/search?${toSearchParams(filters)}`,
        )
      ).map(withDates),
    placeholderData: keepPreviousData,
  });
}

export function useProjectComments(
  projectId: string,
  initialData?: ProjectComment[],
) {
  return useQuery({
    queryKey: projectKeys.comments(projectId),
    initialData,
    queryFn: async () =>
      (
        await fetchJson<ProjectComment[]>(`/api/projects/${projectId}/comments`)
      ).map(withDates),
  });
}

/** Comment mutations refresh that project's comments and the feed counts. */
function useCommentMutation<TInput>(
  projectId: string,
  action: (input: TInput) => Promise<Parameters<typeof getActionError>[0]>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: TInput) => {
      const result = await action(input);
      const error = getActionError(result);
      if (error) throw new Error(error);
      return result;
    },
    onError: (err) => toast.error(err.message),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: projectKeys.comments(projectId) });
      qc.invalidateQueries({ queryKey: ["projects", "feed"] });
    },
  });
}

export const useCreateComment = (projectId: string) =>
  useCommentMutation(projectId, (content: string) =>
    createComment({ projectId, content }),
  );

export const useDeleteComment = (projectId: string) =>
  useCommentMutation(projectId, (commentId: string) =>
    deleteComment({ commentId }),
  );
