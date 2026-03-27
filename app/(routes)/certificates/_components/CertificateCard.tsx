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
  ({ cert, currentUser }: { cert: CertificateType; currentUser: UserType }) => {
    return (
      <div className="flex w-full h-full flex-col space-y-4 rounded-lg bg-neutral-200 dark:bg-dark/80 p-4 border border-transparent hover:border-border transition-all">
        {/* header view and actions */}
        <div className="w-full flex items-center justify-between gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <div className="cursor-pointer text-[10px] font-bold text-muted-foreground py-1 px-4 rounded-full border border-neutral-400 dark:border-neutral-600 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-1 uppercase tracking-tight">
                <EyeIcon className="size-3" />
                View
              </div>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="max-w-[800px] bg-transparent border-none p-0"
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
                  className="w-full h-auto object-contain rounded-lg"
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
        <div className="relative w-full h-48 overflow-hidden rounded-lg">
          <Image
            src={cert.image || "/empty-img.webp"}
            alt="certificate-preview"
            fill
            className="object-cover object-top hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* info */}
        <div className="flex flex-col items-start gap-1 flex-grow">
          <div className="flex items-start justify-between gap-2 w-full">
            <p className="text-md font-bold tracking-tight text-foreground line-clamp-1">
              {cert.title}
            </p>
          </div>
          <p className="text-[10px] font-medium text-primary uppercase tracking-wider">
            {cert.acquiredDate
              ? new Date(cert.acquiredDate).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : "Date not available"}
          </p>

          <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
            {cert.description || "No description provided."}
          </p>
        </div>
      </div>
    );
  },
);

CertificateCard.displayName = "CertificateCard";

export default CertificateCard;
