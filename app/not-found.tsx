import type { Metadata } from "next";
import Link from "next/link";
import { CompassIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 pt-14">
      <div className="w-full max-w-md rounded-lg border bg-card">
        <EmptyState
          icon={CompassIcon}
          title="This page doesn't exist"
          description="The link may be broken, or the page may have been removed."
          action={
            <Button asChild>
              <Link href="/">Go to feed</Link>
            </Button>
          }
        />
      </div>
    </main>
  );
}
