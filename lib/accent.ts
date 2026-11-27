/**
 * Visitor-selectable accent ("theme color"). The colors live in
 * app/globals.css as [data-accent="…"] presets; this file only knows the ids.
 * The choice is stored in localStorage and applied to <html data-accent>
 * before first paint by ACCENT_INIT_SCRIPT, so there is no flash.
 */
export const ACCENTS = [
  { id: "blue", label: "Blue" },
  { id: "green", label: "Green" },
  { id: "purple", label: "Purple" },
  { id: "rose", label: "Rose" },
  { id: "amber", label: "Amber" },
  { id: "teal", label: "Teal" },
] as const;

export type AccentId = (typeof ACCENTS)[number]["id"];

export const DEFAULT_ACCENT: AccentId = "blue";
export const ACCENT_STORAGE_KEY = "accent";

export function isAccentId(value: unknown): value is AccentId {
  return ACCENTS.some((accent) => accent.id === value);
}

/** Inline <head> script: applies the saved accent before React hydrates. */
export const ACCENT_INIT_SCRIPT = `try{var a=localStorage.getItem(${JSON.stringify(
  ACCENT_STORAGE_KEY,
)});if(${JSON.stringify(ACCENTS.map((x) => x.id))}.indexOf(a)>-1)document.documentElement.dataset.accent=a}catch(e){}`;
