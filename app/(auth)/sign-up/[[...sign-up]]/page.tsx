import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignupPage = () => {
  return (
    <main className="flex items-center justify-center h-screen">
      <SignUp />
    </main>
  );
};

export default SignupPage;
