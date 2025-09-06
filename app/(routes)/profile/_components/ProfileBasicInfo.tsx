"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon, ShieldCheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ProfileBasicInfo = ({ numberOfUsers }: { numberOfUsers: number }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleImageClick = () => {
    setIsProfileOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileOpen(false);
  };

  return (
    <div className="rounded-lg w-full h-[400px] dark:bg-dark flex flex-col items-center relative">
      {/* cover photo */}
      <div className="h-[35%] w-full">
        <Image
          src={"/cover-img.jpg"}
          alt="cover-img"
          width={1000}
          height={1000}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>

      {/* profile info */}
      <div className="h-[65%] w-full p-[10px] overflow-auto no-scrollbar ">
        <div onClick={handleImageClick} className="cursor-pointer">
          <Image
            src={"/profile-img-3.png"}
            alt="cover-img"
            width={1000}
            height={1000}
            className="w-[152px] h-[152px] object-fill rounded-full border-3 border-white dark:border-dark absolute top-7 left-6"
          />
        </div>

        <div className="mt-8 px-5 flex flex-col lg:flex-row items-start gap-2 justify-between">
          <div className=" flex flex-col gap-[2px]">
            <Link
              href={"/profile"}
              className="text-2xl font-bold hover:underline hover:opacity-[0.8] transition-all ease-linear duration-200"
            >
              John Carlo Misa
            </Link>
            <div className="border-blue-400 text-blue-400 border border-dashed px-3 flex items-center gap-1 rounded-full w-fit">
              <ShieldCheckIcon className="size-4 text-blue-400" />
              <p className="text-sm font-bold">Profile Owner</p>
            </div>
            <span className="text-sm">Fullstack Developer 🚀</span>

            <p className=" my-2">
              <span className="text-sm text-muted-foreground">
                San Pablo, Calabarzon, Philippines
              </span>{" "}
              •{" "}
              <Link
                href={"/contact"}
                className="text-sm underline cursor-pointer text-blue-300"
              >
                Contact Info
              </Link>
            </p>

            {/* number of users signed in */}
            <p className="text-sm font-bold text-blue-400">
              {numberOfUsers || 0}+ portfolio connections
            </p>
          </div>

          {/* experience and education */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <Image
                src={"/ptp.webp"}
                alt="school-img"
                width={1000}
                height={1000}
                className="w-[20px] h-[20px] object-fill rounded-md"
              />
              <p className="font-bold text-sm uppercase">
                PHILADELPHIA TRUCK PARTS{" "}
                <span className="text-[9px] text-muted-foreground italic">
                  (current)
                </span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Image
                src={"/lspu-logo.png"}
                alt="school-img"
                width={1000}
                height={1000}
                className="w-[20px] h-[20px] object-fill rounded-md"
              />
              <p className="font-bold text-sm ">
                Laguna State Polytechnic University - San Pablo City
              </p>
            </div>
          </div>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="text-xs flex items-center justify-center gap-1 cursor-pointer absolute bottom-2 right-2"
              variant={"outline"}
              size={"sm"}
            >
              <DownloadIcon className="size-4" />
              Download Resume
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-2" align="end">
            <span
              className="cursor-pointer text-sm"
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/Resume-IT.pdf";
                link.download = "John_Carlo_Misa_Resume_IT.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              IT Resume
            </span>
            <span
              className="cursor-pointer text-sm"
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/Resume-VA-General.pdf";
                link.download = "John_Carlo_Misa_Resume_VA.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              VA Resume
            </span>
          </PopoverContent>
        </Popover>
      </div>

      {isProfileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={handleCloseProfileModal}
        >
          <div className="relative">
            <button
              onClick={handleCloseProfileModal}
              className="absolute top-4 right-4 text-white text-2xl z-50"
            >
              &times;
            </button>
            <Image
              src={"/profile-img-3.png"}
              alt="cover-img"
              width={1000}
              height={1000}
              className="max-w-screen-lg max-h-screen-lg p-8"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileBasicInfo;
