"use client";

import { useSyncExternalStore } from "react";
import {
  ACCENT_STORAGE_KEY,
  DEFAULT_ACCENT,
  isAccentId,
  type AccentId,
} from "@/lib/accent";

const EVENT = "accent-change";

function subscribe(onChange: () => void) {
  // Another tab changed the accent: mirror it on this page too
  const onStorage = (event: StorageEvent) => {
    if (event.key !== ACCENT_STORAGE_KEY) return;
    apply(isAccentId(event.newValue) ? event.newValue : DEFAULT_ACCENT);
    onChange();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function read(): AccentId {
  const value = document.documentElement.dataset.accent;
  return isAccentId(value) ? value : DEFAULT_ACCENT;
}

function apply(accent: AccentId) {
  const root = document.documentElement;
  if (accent === DEFAULT_ACCENT) delete root.dataset.accent;
  else root.dataset.accent = accent;
}

/** Current accent + setter; persists to localStorage and updates every subscriber. */
export function useAccent() {
  const accent = useSyncExternalStore(subscribe, read, () => DEFAULT_ACCENT);

  const setAccent = (next: AccentId) => {
    apply(next);
    try {
      if (next === DEFAULT_ACCENT) localStorage.removeItem(ACCENT_STORAGE_KEY);
      else localStorage.setItem(ACCENT_STORAGE_KEY, next);
    } catch {
      // Private mode / blocked storage: the choice still applies for this visit
    }
    window.dispatchEvent(new Event(EVENT));
  };

  return { accent, setAccent };
}
