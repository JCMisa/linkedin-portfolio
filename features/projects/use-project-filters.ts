"use client";

import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { PROJECT_CATEGORIES, type ProjectCategory } from "./constants";

/**
 * Project search + category live in the URL (?q=…&category=…), so a filtered
 * feed or grid can be shared, survives refresh, and works with Back/Forward.
 * Unknown categories in the URL are ignored by the literal parser.
 */
export const projectFilterParsers = {
  q: parseAsString.withDefault(""),
  category: parseAsStringLiteral(PROJECT_CATEGORIES),
};

export function useProjectFilters() {
  const [{ q, category }, setFilters] = useQueryStates(projectFilterParsers, {
    // Typing shouldn't flood the history stack
    history: "replace",
  });

  return {
    search: q,
    category,
    setSearch: (value: string) => setFilters({ q: value || null }),
    setCategory: (value: ProjectCategory | null) =>
      setFilters({ category: value }),
    reset: () => setFilters(null),
  };
}
