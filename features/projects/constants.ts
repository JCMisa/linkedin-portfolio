/**
 * Zod-free project constants. Client code that only needs these values
 * (e.g. the URL filter parsers) imports from here so zod isn't bundled.
 */
export const PROJECT_CATEGORIES = ["software", "virtual", "others"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
