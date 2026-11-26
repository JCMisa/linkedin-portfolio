"use client";

import { memo } from "react";
import Image from "next/image";
import DeleteCertificate from "./DeleteCertificate";
import EditCertificate from "./EditCertificate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EyeIcon } from "lucide-react";

const CertificateCard = memo(
  ({
    cert,
    currentUser,
  }: {
    cert: CertificateType;
    currentUser: UserType | null;
  }) => {
    return (
      <div className="flex h-full w-full flex-col space-y-4 rounded-lg border border-transparent bg-neutral-200 p-4 transition-all hover:border-border dark:bg-dark/80">
        {/* header view and actions */}
        <div className="flex w-full items-center justify-between gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex cursor-pointer items-center justify-center gap-1 rounded-full border border-neutral-400 px-4 py-1 text-[10px] font-bold tracking-tight text-muted-foreground uppercase transition-all hover:border-primary hover:bg-primary hover:text-white dark:border-neutral-600">
                <EyeIcon className="size-3" />
                View
              </div>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="max-w-[800px] border-none bg-transparent p-0"
            >
              <DialogHeader className="sr-only">
                <DialogTitle>{cert.title}</DialogTitle>
                <DialogDescription>Full view of certificate</DialogDescription>
              </DialogHeader>
              <div className="relative flex items-center justify-center">
                <Image
                  src={cert.image || "/empty-img.webp"}
                  alt={cert.title}
                  width={1200}
                  height={1200}
                  className="h-auto w-full rounded-lg object-contain"
                  priority
                />
              </div>
            </DialogContent>
          </Dialog>

          {currentUser?.role === "admin" && (
            <div className="flex items-center gap-2">
              <EditCertificate certificate={cert} />
              <DeleteCertificate certificate={cert} />
            </div>
          )}
        </div>

        {/* image preview */}
        <div className="relative h-48 w-full overflow-hidden rounded-lg">
          <Image
            src={cert.image || "/empty-img.webp"}
            alt="certificate-preview"
            fill
            className="object-cover object-top transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* info */}
        <div className="flex flex-grow flex-col items-start gap-1">
          <div className="flex w-full items-start justify-between gap-2">
            <p className="text-md line-clamp-1 font-bold tracking-tight text-foreground">
              {cert.title}
            </p>
          </div>
          <p className="text-[10px] font-medium tracking-wider text-primary uppercase">
            {cert.acquiredDate
              ? new Date(cert.acquiredDate).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : "Date not available"}
          </p>

          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {cert.description || "No description provided."}
          </p>
        </div>
      </div>
    );
  },
);

CertificateCard.displayName = "CertificateCard";

export default CertificateCard;
