import { AuthCardSkeleton } from "@/components/shared/AuthCardSkeleton";

export default function AuthLoading() {
  return (
    <main
      id="main-content"
      aria-busy="true"
      className="mt-20 flex min-h-screen items-center justify-center sm:mt-3"
    >
      <span className="sr-only" role="status">
        Loading…
      </span>
      <AuthCardSkeleton />
    </main>
  );
}
