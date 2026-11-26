import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { getActionError, type ActionResult } from "@/lib/action-result";

/**
 * Copies server-side field validation errors onto the form so they show
 * under the matching inputs. Returns the first error message (or null on
 * success) for a toast.
 */
export function applyActionResult<T extends FieldValues>(
  form: UseFormReturn<T>,
  result: ActionResult<unknown>,
): string | null {
  const fieldErrors = result?.validationErrors?.fieldErrors ?? {};
  for (const [name, messages] of Object.entries(fieldErrors)) {
    if (messages?.[0]) form.setError(name as Path<T>, { message: messages[0] });
  }
  return getActionError(result);
}
