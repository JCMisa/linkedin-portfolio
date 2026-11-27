import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <div
      role="status"
      className="mt-40 flex flex-col items-center justify-center gap-8"
    >
      <span className="sr-only">Loading…</span>
      <div className="flex items-center justify-center">
        <p aria-hidden className="text-6xl font-bold tracking-wider">
          JCM
        </p>
        <Image
          src={"/logo.png"}
          alt=""
          width={80}
          height={80}
          className="rounded-[3px]"
        />
      </div>

      <span className="loader h-[3px] w-[50%] rounded-full bg-muted lg:w-[10%]"></span>
    </div>
  );
};

export default Loader;
