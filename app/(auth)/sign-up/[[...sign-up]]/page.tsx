import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { AuthCardSkeleton } from "@/components/shared/AuthCardSkeleton";

export const metadata: Metadata = {
  title: "Join now",
  robots: { index: false, follow: false },
};

const SignupPage = () => {
  return (
    <main
      id="main-content"
      className="mt-36 flex min-h-screen items-center justify-center sm:mt-20"
    >
      <SignUp fallback={<AuthCardSkeleton />} />
    </main>
  );
};

export default SignupPage;
