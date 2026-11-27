import type { Metadata } from "next";
import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";
import { AuthCardSkeleton } from "@/components/shared/AuthCardSkeleton";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

const SigninPage = () => {
  return (
    <main
      id="main-content"
      className="mt-20 flex min-h-screen items-center justify-center sm:mt-3"
    >
      {/* Clerk reads the URL for its routing, so the form streams in */}
      <Suspense fallback={<AuthCardSkeleton />}>
        <SignIn fallback={<AuthCardSkeleton />} />
      </Suspense>
    </main>
  );
};

export default SigninPage;
