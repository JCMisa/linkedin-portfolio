"use server";

import { getSessionUser } from "@/lib/auth";

// --------------------------- Server Actions ---------------------------

/** The signed-in user's own record, or null when signed out. */
export const getCurrentUser = async () => getSessionUser();
