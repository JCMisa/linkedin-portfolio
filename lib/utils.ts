import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names. Imported by nearly every component, so keep
 * this module tiny: anything heavier belongs in its own file.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
