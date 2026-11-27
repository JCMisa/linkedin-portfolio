"use client";

import { forwardRef, type ComponentProps } from "react";
import { PenBoxIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Round "edit" button used as a dialog trigger on profile sections. */
export const EditIconButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & { label: string }
>(({ label, className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label={label}
    title={label}
    className={cn(
      "flex size-7 flex-none cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
      className,
    )}
    {...props}
  >
    <PenBoxIcon className="size-4" />
  </button>
));
EditIconButton.displayName = "EditIconButton";
