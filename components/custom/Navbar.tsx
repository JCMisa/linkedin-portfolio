"use client";

import Image from "next/image";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { usePathname } from "next/navigation";
import {
  ActivityIcon,
  BriefcaseBusinessIcon,
  GalleryVerticalEndIcon,
  HomeIcon,
  LaptopMinimalIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

const menuItems = [
  {
    id: 1,
    title: "Home",
    icon: HomeIcon,
    path: "/",
  },
  {
    id: 2,
    title: "Projects",
    icon: LaptopMinimalIcon,
    path: "/projects",
  },
  {
    id: 3,
    title: "Experience",
    icon: BriefcaseBusinessIcon,
    path: "/experience",
  },
  {
    id: 4,
    title: "Certificates",
    icon: GalleryVerticalEndIcon,
    path: "/certificates",
  },
  {
    id: 5,
    title: "Skills",
    icon: ActivityIcon,
    path: "/skills",
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="h-[53px] w-full px-4 lg:pl-[80px] lg:pr-[24px] border border-b dark:bg-dark flex items-center fixed top-0 z-50">
      <div className="w-[80%] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={34.17}
            height={34.17}
            className="rounded-[3px]"
          />
          <div className="relative rounded-full w-[280px] h-[34px] border border-neutral-600 pl-[40px] pr-[16px] flex items-center justify-center">
            <SearchIcon className="size-4 absolute top-2 left-5" />
            <Input
              className="bg-transparent text-gray-500 dark:text-gray-400 text-lg border-none focus:border-none focus:outline-none active:border-none"
              placeholder="Search"
              style={{ background: "none", boxShadow: "none" }}
            />
          </div>
        </div>

        {/* menu items */}
        <div className="flex items-center">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.path}
                className={
                  "w-[80px] h-[52px] flex flex-col items-center justify-center border-b " +
                  (isActive
                    ? "border-b-[2px] border-b-black dark:border-b-white text-black dark:text-white"
                    : "border-b-transparent text-muted-foreground")
                }
              >
                <Icon
                  className={
                    "size-5 " + (isActive ? "" : "text-muted-foreground")
                  }
                />
                <span
                  className={
                    "text-[12px] leading-none mt-1 " +
                    (isActive ? "" : "text-muted-foreground")
                  }
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* user icon */}
      {user && (
        <div className="w-[52px] h-[52px] flex flex-col items-start justify-center">
          <UserButton />
        </div>
      )}
      <Separator orientation="vertical" />
      <div className="w-[20%] flex items-center">
        <Link
          href={"/about"}
          className={
            "w-[80px] h-[52px] flex flex-col items-center justify-center border-b "
          }
        >
          <UserIcon className={"size-5 "} />
          <span className={"text-[12px] leading-none mt-1 "}>About Me</span>
        </Link>

        <Link
          href={"/contact"}
          className={
            "w-[80px] h-[52px] flex flex-col items-center justify-center border-b "
          }
        >
          <PhoneIcon className={"size-5 "} />
          <span className={"text-[12px] leading-none mt-1 "}>Contact Me</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
