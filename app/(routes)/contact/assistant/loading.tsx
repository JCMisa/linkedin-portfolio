import { Skeleton } from "@/components/ui/skeleton";
import { PageSkeleton } from "@/components/shared/skeletons";

/** Voice assistant: heading + call stage. */
export default function AssistantLoading() {
  return (
    <PageSkeleton className="flex min-h-screen flex-col items-center bg-muted p-0 pt-16 md:p-0 md:pt-16 lg:p-0 lg:pt-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-7 w-72 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-[80vh] max-h-[800px] min-h-[500px] w-full rounded-3xl" />
      </div>
    </PageSkeleton>
  );
}
