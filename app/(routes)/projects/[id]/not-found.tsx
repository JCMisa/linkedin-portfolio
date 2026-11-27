import Link from "next/link";
import { FolderXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

export default function ProjectNotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 pt-14"
    >
      <div className="w-full max-w-md rounded-lg border bg-card">
        <EmptyState
          titleAs="h1"
          icon={FolderXIcon}
          title="This project isn't available"
          description="It may have been removed, or the link is incorrect."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild>
                <Link href="/projects">Browse projects</Link>
              </Button>
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
