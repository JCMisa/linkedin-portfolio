import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import React from "react";

export const metadata: Metadata = {
  title: "Join now",
  robots: { index: false, follow: false },
};

const SignupPage = () => {
  return (
    <main className="mt-36 flex min-h-screen items-center justify-center sm:mt-20">
      <SignUp />
    </main>
  );
};

export default SignupPage;
