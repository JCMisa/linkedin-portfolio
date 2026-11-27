"use client";

import type { ReactNode } from "react";
import { useCurrentUser } from "../hooks";

/**
 * Renders its children only for admins/owners. The role is read on the client
 * (cached per session by TanStack Query; no request when signed out), so the
 * pages around it stay static and prerender without reading the session.
 *
 * UI gating only: every admin action re-checks the role on the server.
 */
export function AdminOnly({ children }: { children: ReactNode }) {
  const { isAdmin } = useCurrentUser();
  return isAdmin ? children : null;
}
