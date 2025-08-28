"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRightIcon, EyeIcon, ViewIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const CertificatesPreview = () => {
  const [selectedCert, setSelectedCert] = useState<number | null>(null);

  return (
    <div className="h-[394px] w-full dark:bg-dark flex flex-col items-start gap-4 rounded-lg p-3 overflow-x-hidden overflow-y-auto no-scrollbar">
      {/* header */}
      <div className="flex items-center w-full gap-2 justify-between">
        <h2 className="font-bold text-md">Proof in Paper</h2>
        {/* see more icon */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={"/certificates"}>
              <ViewIcon className="size-4 hover:opacity-[0.8] transition-opacity duration-200 ease-in-out" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="transition-all duration-200 ease-linear">
            <p className="text-xs">View More</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* certifications list */}
      <div className="flex flex-col items-start gap-2 w-full">
        {[1, 2, 3, 4, 5].slice(0, 3).map((cert) => (
          // cert preview card
          <div
            key={cert}
            className="flex items-start gap-2 overflow-hidden w-full p-2"
          >
            <Image
              src={"https://i.ibb.co/ccLY73Vp/Great-Stack-Certificate.png"}
              alt={`certificate-${cert}`}
              width={1000}
              height={1000}
              className="w-14 h-14 object-cover rounded-full"
            />

            <div className="flex flex-col items-start">
              <p className="text-sm font-bold truncate w-[80%]">
                Introduction to Large Language Model
              </p>
              <span className="text-xs text-muted-foreground truncate">
                June 10, 2025
              </span>

              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="cursor-pointer mt-1 text-xs text-muted-foreground py-[6px] px-5 rounded-full border border-black dark:border-white flex items-center justify-center gap-1"
                    onClick={() => setSelectedCert(cert)}
                  >
                    <EyeIcon className="size-3" />
                    View
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] bg-transparent border-none">
                  <DialogHeader>
                    <DialogTitle className="sr-only">
                      Are you absolutely sure?
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="relative">
                    <button
                      onClick={() => setSelectedCert(null)}
                      className="absolute -top-8 right-0 p-2 rounded-full bg-background hover:bg-accent transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                    <Image
                      src={
                        "https://i.ibb.co/ccLY73Vp/Great-Stack-Certificate.png"
                      }
                      alt={`certificate-${cert}-full`}
                      width={1000}
                      height={1000}
                      className="w-full h-auto object-contain rounded-lg mt-1"
                      priority
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>

      <Link
        href={"/certificates"}
        className="w-full px-4 flex items-center gap-1"
      >
        <p className="text-xs leading-[16px]">View All Certificates</p>
        <ArrowRightIcon className="size-3" />
      </Link>
    </div>
  );
};

export default CertificatesPreview;
