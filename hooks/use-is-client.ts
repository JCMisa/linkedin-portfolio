"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * true in the browser, false during SSR and hydration. A render-safe
 * replacement for the `useEffect(() => setMounted(true))` pattern.
 */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
