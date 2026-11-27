/** Shape returned by every next-safe-action call (flattened validation errors). */
export type ActionResult<T> =
  | {
      data?: T;
      serverError?: string;
      validationErrors?: {
        formErrors: string[];
        fieldErrors: Partial<Record<string, string[]>>;
      };
    }
  | undefined;

/** First human-readable error from an action result, or null if it succeeded. */
export function getActionError<T>(
  result: ActionResult<T>,
  fallback = "Something went wrong. Please try again.",
): string | null {
  if (!result) return fallback;
  if (result.serverError) return result.serverError;
  const v = result.validationErrors;
  if (v) {
    const first =
      v.formErrors[0] ?? Object.values(v.fieldErrors).flat().find(Boolean);
    return first ?? fallback;
  }
  return null;
}
