import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-extrabold text-muted-foreground">404</h1>
      <p className="mt-2 text-lg">That page doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-6 inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
      >
        Go home
      </Link>
    </div>
  );
}
