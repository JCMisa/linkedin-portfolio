import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProfileCard = () => {
  return (
    <div className="h-[210px] w-full bg-neutral-100 dark:bg-dark flex flex-col items-center rounded-lg">
      {/* cover photo */}
      <div className="h-[30%] w-full">
        <Image
          src={"/cover-img.jpg"}
          alt="cover-img"
          width={1000}
          height={1000}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>

      {/* profile info */}
      <div className="h-[70%] w-full p-[10px] relative">
        <Image
          src={"/profile-img-3.png"}
          alt="cover-img"
          width={1000}
          height={1000}
          className="w-[72px] h-[72px] object-fill rounded-full border-2 border-white dark:border-dark absolute -top-8 left-4"
        />
        <div className="mt-8 px-2 flex flex-col gap-[2px]">
          <Link
            href={"/profile"}
            className="text-lg font-bold tracking-wider hover:underline hover:opacity-[0.8] transition-all ease-linear duration-200"
          >
            John Carlo Misa
          </Link>
          <span className="text-xs font-semibold">Fullstack Developer 🚀</span>
          <span className="text-xs font-semibold text-muted-foreground">
            San Pablo, Calabarzon
          </span>
          <div className="flex items-center gap-1 mt-1">
            <Image
              src={"/ptp.webp"}
              alt="placeholder-img"
              width={1000}
              height={1000}
              className="w-4 h-4 rounded-sm object-cover"
            />
            <p className="text-xs font-bold uppercase">
              Philadelphia Truck Parts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
