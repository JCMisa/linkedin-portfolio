import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: ReactNode;
  /** Optional call to action, e.g. a <Button> or <Link>. */
  action?: ReactNode;
  /** "compact" for inline lists (comments, reactions); "default" for sections and pages. */
  size?: "default" | "compact";
  /** Heading level for the title; use "h1" when the empty state is the whole page. */
  titleAs?: "h1" | "h2" | "h3" | "p";
  className?: string;
}

/**
 * One look for every "nothing here" moment: an accent-tinted icon, a short
 * title, an optional hint and action. Colors follow the theme accent.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  size = "default",
  titleAs: Title = "p",
  className,
}: EmptyStateProps) {
  const compact = size === "compact";

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center text-center",
        compact ? "gap-2 py-4" : "gap-3 px-6 py-10",
        className,
      )}
    >
      {Icon && (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary",
            compact ? "size-9" : "size-14",
          )}
        >
          <Icon className={compact ? "size-4" : "size-7"} aria-hidden />
        </div>
      )}
      <div className="max-w-sm space-y-1">
        <Title
          className={cn(
            "font-semibold text-foreground",
            compact ? "text-sm" : "text-base",
          )}
        >
          {title}
        </Title>
        {description && (
          <p
            className={cn(
              "text-muted-foreground",
              compact ? "text-xs" : "text-sm",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
