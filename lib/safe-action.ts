import "server-only";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { requireAdmin, requireUser } from "@/lib/auth";
import { ActionError } from "@/lib/errors";

/**
 * Base client for all server actions.
 * - Inputs are validated with the zod schema passed to `.inputSchema()`.
 * - Validation errors come back as `{ formErrors, fieldErrors }`.
 * - Only `ActionError` messages reach the client; everything else is logged.
 */
export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: "flattened",
  handleServerError(error) {
    if (error instanceof ActionError) return error.message;
    console.error("[server action]", error);
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

/** Requires a signed-in user; exposes it as `ctx.user`. */
export const authActionClient = actionClient.use(async ({ next }) =>
  next({ ctx: { user: await requireUser() } }),
);

/** Requires an admin/owner; exposes it as `ctx.user`. */
export const adminActionClient = actionClient.use(async ({ next }) =>
  next({ ctx: { user: await requireAdmin() } }),
);
