"use client";

import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import {
  ActivityIcon,
  BriefcaseBusinessIcon,
  GalleryVerticalEndIcon,
  HomeIcon,
  LaptopMinimalIcon,
  MenuIcon,
  PhoneIcon,
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
import { Button } from "@/components/ui/button";
import ModeToggle from "./ModeToggle";
import SearchDialog from "./SearchDialog";

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

  return (
    <header className="fixed top-0 z-50 flex h-[53px] w-full items-center border-b bg-card px-4 lg:pr-[24px] lg:pl-[80px]">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" aria-label="JCM Portfolio home" className="shrink-0">
            <Image
              src={"/logo.png"}
              alt=""
              width={34}
              height={34}
              className="rounded-[3px]"
              priority
            />
          </Link>
          <SearchDialog />
        </div>

        {/* menu items - large screen */}
        <nav aria-label="Main" className="hidden items-center md:flex">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.path}
                aria-current={isActive ? "page" : undefined}
                className={
                  "flex h-[52px] w-[64px] flex-col items-center justify-center border-b lg:w-[80px] " +
                  (isActive
                    ? "border-b-2 border-b-foreground text-foreground"
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
                    "mt-1 text-[12px] leading-none " +
                    (isActive ? "" : "text-muted-foreground")
                  }
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* menu items - small screen */}
        <Sheet>
          <SheetTrigger
            aria-label="Open menu"
            className="mr-2 block cursor-pointer rounded-sm md:hidden"
          >
            <MenuIcon aria-hidden />
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] bg-card sm:w-[400px]">
            <SheetHeader className="space-y-4">
              <SheetTitle className="text-left text-lg font-bold">
                Explore my portfolio
              </SheetTitle>
              <SheetDescription className="sr-only">
                Navigate through pages and view more about me.
              </SheetDescription>
              <div className="flex flex-col gap-4">
                <SearchDialog
                  forMobile={true}
                  additionalClassName="!w-full"
                  contentClassName="!w-full border border-border"
                />

                <Separator />

                {/* Menu Items */}
                <nav aria-label="Mobile" className="mt-2 space-y-4">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.id}
                        href={item.path}
                        aria-current={isActive ? "page" : undefined}
                        className={
                          "flex items-center gap-4 rounded-lg p-2 transition-colors " +
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
                </nav>

                <Separator className="my-4" />

                {/* Additional Menu Items */}
                <div className="space-y-4">
                  <Link
                    href="/profile"
                    className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <UserIcon className="size-5" />
                    <span className="text-base">About Me</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-accent hover:text-accent-foreground"
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
      <div className="ml-1 block md:hidden lg:block">
        <ModeToggle />
      </div>

      {/* user icon */}
      {user ? (
        <div className="mx-2 flex h-[52px] w-[52px] flex-col items-start justify-center">
          <UserButton />
        </div>
      ) : (
        <Button variant="outline" size="sm" className="mx-2" asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>
      )}

      <Separator orientation="vertical" className="hidden lg:block" />

      <div className="hidden w-[20%] items-center lg:flex">
        <Link
          href={"/profile"}
          className={
            "flex h-[52px] w-[80px] flex-col items-center justify-center border-b"
          }
        >
          <UserIcon className={"size-5"} />
          <span className={"mt-1 text-[12px] leading-none"}>About Me</span>
        </Link>

        <Link
          href={"/contact"}
          className={
            "flex h-[52px] w-[80px] flex-col items-center justify-center border-b"
          }
        >
          <PhoneIcon className={"size-5"} />
          <span className={"mt-1 text-[12px] leading-none"}>Contact Me</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
