"use client";

import { useEffect } from "react";
import { TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import "./globals.css";

// Runs before paint so the fallback page matches the visitor's theme
// (the ThemeProvider in the root layout isn't mounted when this renders).
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

/** Last-resort boundary: replaces the root layout when it fails to render. */
export default function GlobalError({
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Something went wrong | John Carlo Misa</title>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <main className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-lg border bg-card">
            <EmptyState
              icon={TriangleAlertIcon}
              title="Something went wrong"
              description="The site hit an unexpected error. Please try again in a moment."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  <Button onClick={reset}>Try again</Button>
                  <Button variant="outline" asChild>
                    {/* Full reload on purpose: the app shell failed, so client navigation can't be trusted */}
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a href="/">Go to feed</a>
                  </Button>
                </div>
              }
            />
          </div>
        </main>
      </body>
    </html>
  );
}
