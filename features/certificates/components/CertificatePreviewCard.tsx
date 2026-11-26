"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EyeIcon } from "lucide-react";

const CertificatePreviewCard = ({ cert }: { cert: any }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex w-full items-start gap-2 overflow-hidden p-2">
      <Image
        src={cert.image || "/empty-img.webp"}
        alt={`certificate-${cert.title}`}
        width={100}
        height={100}
        className="h-14 w-14 rounded-full object-cover"
      />

      <div className="flex flex-col items-start">
        <p className="line-clamp-1 truncate text-sm font-bold">{cert.title}</p>

        {/* We use suppressHydrationWarning AND the mounted check for double safety */}
        <span
          className="truncate text-xs text-muted-foreground"
          suppressHydrationWarning
        >
          {mounted && cert?.acquiredDate
            ? new Date(cert.acquiredDate).toLocaleDateString()
            : "Loading date..."}
        </span>

        {mounted ? (
          <Dialog>
            <DialogTrigger asChild>
              <button className="mt-1 flex cursor-pointer items-center justify-center gap-1 text-xs text-muted-foreground transition-transform duration-200 ease-linear hover:underline">
                <EyeIcon className="size-3" />
                View
              </button>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="flex max-h-[400px] max-w-[800px] items-center justify-center border-none bg-transparent p-0"
            >
              <DialogHeader>
                <DialogTitle className="sr-only">
                  Certificate: {cert.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Full view of the earned certificate.
                </DialogDescription>
              </DialogHeader>
              <div className="relative w-full">
                <Image
                  src={cert.image || "/empty-img.webp"}
                  alt={`certificate-${cert.title}-full`}
                  width={1000}
                  height={1000}
                  className="h-auto max-h-[80vh] w-full rounded-lg object-contain shadow-2xl"
                  priority
                />
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="mt-1 h-[28px] w-[75px] animate-pulse rounded-full border border-muted bg-muted" />
        )}
      </div>
    </div>
  );
};

export default CertificatePreviewCard;
