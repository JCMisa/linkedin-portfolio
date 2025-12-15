"use client";

import Image from "next/image";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import {
  ActivityIcon,
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
import ModeToggle from "./ModeToggle";
import SearhPage from "./SearhPage";

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
  {
    id: 5,
    title: "Skills",
    icon: ActivityIcon,
    path: "/profile/#skills",
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const router = useRouter();

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
          <SearhPage />
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
        </div>

        {/* menu items - small screen */}
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="block md:hidden cursor-pointer" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[300px] sm:w-[400px] bg-neutral-100 dark:bg-dark"
          >
            <SheetHeader className="space-y-4">
              <SheetTitle className="text-left text-lg font-bold">
                Explore My Portfolio
              </SheetTitle>
              <SheetDescription className="sr-only">
                Navigate through pages and view more about me.
              </SheetDescription>
              <div className="flex flex-col gap-4">
                <SearhPage
                  forMobile={true}
                  additionalClassName="!w-full"
                  contentClassName="!w-full border border-neutral-900 dark:border-neutral-100"
                />

                <Separator />

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
          className="mx-2 cursor-pointer"
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
