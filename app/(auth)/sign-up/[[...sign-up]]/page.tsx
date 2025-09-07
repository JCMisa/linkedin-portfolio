import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignupPage = () => {
  return (
    <main className="flex items-center justify-center min-h-screen mt-36 sm:mt-20">
      <SignUp />
    </main>
  );
};

export default SignupPage;
