import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <main className="mt-40 flex flex-col items-center justify-center gap-8">
      <div className="flex items-center justify-center">
        <h1 className="text-6xl font-bold tracking-wider">JCM</h1>
        <Image
          src={"/logo.png"}
          alt="logo"
          width={80}
          height={80}
          className="rounded-[3px]"
        />
      </div>

      <span className="loader h-[3px] w-[50%] rounded-full bg-neutral-800 lg:w-[10%] dark:bg-neutral-200"></span>
    </main>
  );
};

export default Loader;
