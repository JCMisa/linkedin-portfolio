import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignupPage = () => {
  return (
    <main className="flex items-center justify-center h-screen mt-3">
      <SignUp />
    </main>
  );
};

export default SignupPage;
