import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <main className="flex flex-col items-center justify-center gap-8 mt-40">
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

      <span className="loader bg-neutral-800 dark:bg-neutral-200 rounded-full w-[50%] lg:w-[10%] h-[3px]"></span>
    </main>
  );
};

export default Loader;
