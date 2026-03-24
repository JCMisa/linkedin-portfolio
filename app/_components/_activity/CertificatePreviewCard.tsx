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
    <div className="flex items-start gap-2 overflow-hidden w-full p-2">
      <Image
        src={cert.image || "/empty-img.webp"}
        alt={`certificate-${cert.title}`}
        width={100}
        height={100}
        className="w-14 h-14 object-cover rounded-full"
      />

      <div className="flex flex-col items-start">
        <p className="text-sm font-bold truncate line-clamp-1">{cert.title}</p>

        {/* We use suppressHydrationWarning AND the mounted check for double safety */}
        <span
          className="text-xs text-muted-foreground truncate"
          suppressHydrationWarning
        >
          {mounted && cert?.acquiredDate
            ? new Date(cert.acquiredDate).toLocaleDateString()
            : "Loading date..."}
        </span>

        {mounted ? (
          <Dialog>
            <DialogTrigger asChild>
              <button className="cursor-pointer mt-1 text-xs text-muted-foreground py-[6px] px-5 rounded-full border border-black dark:border-white flex items-center justify-center gap-1 hover:bg-accent transition-colors">
                <EyeIcon className="size-3" />
                View
              </button>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="max-w-[800px] max-h-[400px] flex items-center justify-center bg-transparent border-none p-0"
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
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
                  priority
                />
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="mt-1 h-[28px] w-[75px] rounded-full border border-muted bg-muted animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default CertificatePreviewCard;
