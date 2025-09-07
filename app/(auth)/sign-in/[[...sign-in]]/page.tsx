import { SignIn } from "@clerk/nextjs";
import React from "react";

const SigninPage = () => {
  return (
    <main className="flex items-center justify-center min-h-screen mt-20 sm:mt-3">
      <SignIn />
    </main>
  );
};

export default SigninPage;
