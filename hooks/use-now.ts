"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// One timestamp per page load keeps the snapshot stable between renders.
let now: Date | undefined;
const getNow = () => (now ??= new Date());

/**
 * The current time in the browser, or null while prerendering and hydrating.
 * Reading `new Date()` during render would bake the build time into the static
 * shell (and Cache Components rejects it), so time-relative UI ("3 yrs",
 * "Current") renders from this instead and appears right after hydration.
 */
export function useNow(): Date | null {
  return useSyncExternalStore(subscribe, getNow, () => null);
}
