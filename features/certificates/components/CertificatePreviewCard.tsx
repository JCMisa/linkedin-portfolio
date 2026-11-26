"use client";

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
import type { CertificatesType } from "@/db/schema";

const CertificatePreviewCard = ({ cert }: { cert: CertificatesType }) => {
  // Fixed locale + UTC so server and browser render the same text (no
  // hydration mismatch, no "mounted" workaround needed)
  const acquired = cert.acquiredDate
    ? new Date(cert.acquiredDate).toLocaleDateString("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

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

        {acquired && (
          <span className="truncate text-xs text-muted-foreground">
            {acquired}
          </span>
        )}

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
      </div>
    </div>
  );
};

export default CertificatePreviewCard;
