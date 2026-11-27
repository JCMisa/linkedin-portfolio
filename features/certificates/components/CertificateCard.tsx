"use client";

import { AdminOnly } from "@/features/users/components/AdminOnly";

import { memo } from "react";
import Image from "next/image";
import { CertificateFormDialog, DeleteCertificate } from "./admin-dialogs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EyeIcon } from "lucide-react";

const CertificateCard = memo(({ cert }: { cert: CertificateType }) => {
  return (
    <article className="flex h-full w-full flex-col space-y-4 rounded-lg border bg-card p-4">
      {/* header view and actions */}
      <div className="flex w-full items-center justify-between gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label={`View ${cert.title} certificate`}
              className="flex cursor-pointer items-center justify-center gap-1 rounded-full border border-primary px-3 py-0.5 text-xs font-semibold text-primary transition-colors hover:bg-primary-soft"
            >
              <EyeIcon className="size-3" />
              View
            </button>
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

        <AdminOnly>
          <div className="flex items-center gap-2">
            <CertificateFormDialog certificate={cert} />
            <DeleteCertificate certificate={cert} />
          </div>
        </AdminOnly>
      </div>

      {/* image preview */}
      <div className="relative h-48 w-full overflow-hidden rounded-lg">
        <Image
          src={cert.image || "/empty-img.webp"}
          alt={`${cert.title} certificate`}
          fill
          className="object-cover object-top transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* info */}
      <div className="flex flex-grow flex-col items-start gap-1">
        <div className="flex w-full items-start justify-between gap-2">
          <h2
            title={cert.title}
            className="line-clamp-2 text-base font-semibold text-foreground"
          >
            {cert.title}
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
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
    </article>
  );
});

CertificateCard.displayName = "CertificateCard";

export default CertificateCard;
