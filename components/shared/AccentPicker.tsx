"use client";

import { CheckIcon } from "lucide-react";
import { ACCENTS } from "@/lib/accent";
import { useAccent } from "@/hooks/use-accent";
import { cn } from "@/lib/utils";

/**
 * Row of accent swatches (a radio group). Each swatch sets data-accent on
 * itself so it previews its own color in the current light/dark mode.
 */
export function AccentPicker({ className }: { className?: string }) {
  const { accent, setAccent } = useAccent();

  return (
    <div
      role="radiogroup"
      aria-label="Theme color"
      className={cn("flex flex-wrap gap-2", className)}
    >
      {ACCENTS.map(({ id, label }) => {
        const selected = accent === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            data-accent={id}
            onClick={() => setAccent(id)}
            className={cn(
              "flex size-7 cursor-pointer items-center justify-center rounded-full bg-[var(--accent-light)] text-primary-foreground transition-transform hover:scale-110 dark:bg-[var(--accent-dark)]",
              selected &&
                "ring-2 ring-foreground ring-offset-2 ring-offset-card",
            )}
          >
            {selected && <CheckIcon className="size-4" strokeWidth={3} />}
          </button>
        );
      })}
    </div>
  );
}
