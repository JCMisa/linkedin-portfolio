import { SignIn } from "@clerk/nextjs";
import React from "react";

const SigninPage = () => {
  return (
    <main className="mt-20 flex min-h-screen items-center justify-center sm:mt-3">
      <SignIn />
    </main>
  );
};

export default SigninPage;
