import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-extrabold text-muted-foreground">404</h1>
      <p className="mt-2 text-lg">That page doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
      >
        Go home
      </Link>
    </div>
  );
}
