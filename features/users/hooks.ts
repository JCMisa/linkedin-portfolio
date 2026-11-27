"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import type { UsersType } from "@/db/schema";
import { isAdminRole } from "@/lib/roles";
import { fetchJson } from "@/lib/fetch-json";

export const userKeys = {
  me: (clerkId: string | null | undefined) => ["users", "me", clerkId] as const,
};

/** The signed-in user's DB record (null when signed out). */
export function useCurrentUser() {
  const { user, isLoaded } = useUser();
  const query = useQuery({
    queryKey: userKeys.me(user?.id),
    queryFn: () => fetchJson<UsersType | null>("/api/users"),
    enabled: isLoaded && !!user,
  });

  return {
    ...query,
    user: user ? (query.data ?? null) : null,
    isAdmin: isAdminRole(query.data?.role),
    isLoading: !isLoaded || (!!user && query.isLoading),
  };
}
