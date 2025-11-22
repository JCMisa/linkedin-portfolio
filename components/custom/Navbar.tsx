"use client";

import Image from "next/image";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { usePathname, useRouter } from "next/navigation";
import {
  BriefcaseBusinessIcon,
  GalleryVerticalEndIcon,
  HomeIcon,
  LaptopMinimalIcon,
  MenuIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import SkillsModal from "./SkillsModal";
import { useState } from "react";
import ModeToggle from "./ModeToggle";

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
    path: "/experiences",
  },
  {
    id: 4,
    title: "Certificates",
    icon: GalleryVerticalEndIcon,
    path: "/certificates",
  },
  // {
  //   id: 5,
  //   title: "Skills",
  //   icon: ActivityIcon,
  //   path: "/skills",
  // },
];

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const router = useRouter();

  const [query, setQuery] = useState("");

  const go = () => {
    const q = query.trim().toLowerCase();
    if (!q) return; // ignore empty
    router.push(`/${encodeURIComponent(q)}`); // e.g.  /projects
  };

  return (
    <div className="h-[53px] w-full px-4 lg:pl-[80px] lg:pr-[24px] border border-b bg-white dark:bg-dark flex items-center fixed top-0 z-50">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={34.17}
            height={34.17}
            className="rounded-[3px]"
          />
          <div className="relative rounded-full w-[280px] h-[34px] border border-neutral-600 pl-[40px] pr-[16px] hidden sm:flex items-center justify-center">
            <SearchIcon className="size-4 absolute top-2 left-5" onClick={go} />
            <Input
              className="bg-transparent text-gray-500 dark:text-gray-400 text-lg border-none focus:border-none focus:outline-none active:border-none"
              placeholder="Go to..."
              style={{ background: "none", boxShadow: "none" }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
            />
          </div>
        </div>

        {/* menu items - large screen */}
        <div className="hidden md:flex items-center">
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
          <SkillsModal view="desktop" />
        </div>

        {/* menu items - small screen */}
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="block md:hidden cursor-pointer" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader className="space-y-4">
              <SheetTitle className="text-left text-lg font-bold">
                Explore My Portfolio
              </SheetTitle>
              <SheetDescription className="sr-only">
                Navigate through pages and view more about me.
              </SheetDescription>
              <div className="flex flex-col gap-4">
                {/* Menu Items */}
                <div className="space-y-4 mt-2">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.id}
                        href={item.path}
                        className={
                          "flex items-center gap-4 p-2 rounded-lg transition-colors " +
                          (isActive
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground")
                        }
                      >
                        <Icon className="size-5" />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    );
                  })}
                  <SkillsModal view="mobile" />
                </div>

                <Separator className="my-4" />

                {/* Additional Menu Items */}
                <div className="space-y-4">
                  <Link
                    href="/profile"
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <UserIcon className="size-5" />
                    <span className="text-base">About Me</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <PhoneIcon className="size-5" />
                    <span className="text-base">Contact Me</span>
                  </Link>
                </div>
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      {/* theme toggler */}
      <div className="block md:hidden lg:block ml-1">
        <ModeToggle />
      </div>

      {/* user icon */}
      {user ? (
        <div className="w-[52px] h-[52px] flex flex-col items-start justify-center mx-2">
          <UserButton />
        </div>
      ) : (
        <Button
          variant={"outline"}
          size={"sm"}
          className="mx-2"
          onClick={() => router.push("/sign-in")}
        >
          Sign In
        </Button>
      )}

      <Separator orientation="vertical" className="hidden lg:block" />

      <div className="w-[20%] hidden lg:flex items-center">
        <Link
          href={"/profile"}
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
