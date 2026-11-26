import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignupPage = () => {
  return (
    <main className="mt-36 flex min-h-screen items-center justify-center sm:mt-20">
      <SignUp />
    </main>
  );
};

export default SignupPage;
