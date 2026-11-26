import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/*
 * Building blocks for route-level loading.tsx files. Each block mirrors the
 * card it stands in for (same radius, border, padding and rough height) so
 * the page doesn't jump when real content streams in.
 */

/** Page frame shared by every loading.tsx; announces the busy state to screen readers. */
export function PageSkeleton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      aria-busy="true"
      className={cn("relative px-6 py-18 md:px-10 lg:px-16", className)}
    >
      <span className="sr-only" role="status">
        Loading…
      </span>
      {children}
    </main>
  );
}

/** Generic card surface. */
export function CardSkeleton({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-lg border bg-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A few lines of paragraph text; the last line is shorter. */
export function TextLinesSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full space-y-2", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

/** Small profile card: cover, avatar, name, headline (ProfileCard / ProfileSection). */
export function ProfileCardSkeleton({ className }: { className?: string }) {
  return (
    <CardSkeleton className={className}>
      <Skeleton className="h-14 w-full rounded-none" />
      <div className="flex flex-col items-center gap-2 px-4 pb-4">
        <Skeleton className="-mt-8 size-16 rounded-full border-4 border-card" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-44" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex items-center gap-2 border-t px-4 py-3">
        <Skeleton className="size-6 rounded-sm" />
        <Skeleton className="h-3 w-28" />
      </div>
    </CardSkeleton>
  );
}

/** Titled list card: thumbnail + two lines per row (certificates, activities). */
export function SidebarListSkeleton({
  rows = 3,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <CardSkeleton className={cn("space-y-4 p-3", className)}>
      <Skeleton className="h-4 w-32" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-start gap-2">
          <Skeleton className="size-12 shrink-0 rounded-md" />
          <div className="flex w-full flex-col gap-2 pt-1">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
      <Skeleton className="h-3 w-28" />
    </CardSkeleton>
  );
}

/** Section card with a heading and body text (About, Services...). */
export function SectionCardSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <CardSkeleton className={cn("space-y-4 p-4 sm:p-6", className)}>
      <Skeleton className="h-5 w-36" />
      <TextLinesSkeleton lines={lines} />
    </CardSkeleton>
  );
}

/** The small link cloud under the sidebar. */
export function FooterSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-4">
      {["w-16", "w-20", "w-14", "w-24", "w-18", "w-12"].map((w, i) => (
        <Skeleton key={i} className={cn("h-3", w)} />
      ))}
    </div>
  );
}

/** Right-hand 320px column used by most pages. */
export function SidebarSkeleton({
  top = <ProfileCardSkeleton />,
  className,
}: {
  top?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-2 lg:w-[320px]", className)}>
      {top}
      <SidebarListSkeleton />
      <div className="mt-2">
        <FooterSkeleton />
      </div>
    </div>
  );
}
