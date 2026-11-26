import type { Metadata } from "next";
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
      <SignIn fallback={<AuthCardSkeleton />} />
    </main>
  );
};

export default SigninPage;
