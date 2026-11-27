"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

/** Catches errors in any page below the root layout (navbar stays visible). */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 pt-14"
    >
      <div className="w-full max-w-md rounded-lg border bg-card">
        <EmptyState
          titleAs="h1"
          icon={TriangleAlertIcon}
          title="Something went wrong"
          description={
            <>
              This page didn&apos;t load properly. Try again, or head back to
              the feed.
              {error.digest && (
                <span className="mt-2 block text-xs">
                  Error ID: {error.digest}
                </span>
              )}
            </>
          }
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={reset}>Try again</Button>
              <Button variant="outline" asChild>
                <Link href="/">Go to feed</Link>
              </Button>
            </div>
          }
        />
      </div>
    </main>
  );
}
