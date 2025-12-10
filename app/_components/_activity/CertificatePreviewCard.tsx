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

const CertificatePreviewCard = ({ cert }: { cert: CertificateType }) => {
  return (
    <div
      key={cert.id}
      className="flex items-start gap-2 overflow-hidden w-full p-2"
    >
      <Image
        src={cert.image || "/empty-img.webp"}
        alt={`certificate-${cert.title}`}
        width={1000}
        height={1000}
        className="w-14 h-14 object-cover rounded-full"
      />

      <div className="flex flex-col items-start">
        <p className="text-sm font-bold truncate line-clamp-1">{cert.title}</p>
        <span className="text-xs text-muted-foreground truncate">
          {cert && cert.acquiredDate
            ? new Date(cert.acquiredDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "Date not available"}
        </span>

        <Dialog>
          <DialogTrigger asChild>
            <button className="cursor-pointer mt-1 text-xs text-muted-foreground py-[6px] px-5 rounded-full border border-black dark:border-white flex items-center justify-center gap-1">
              <EyeIcon className="size-3" />
              View
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-[800px] max-h-[400px] flex items-center justify-center bg-transparent border-none">
            <DialogHeader>
              <DialogTitle className="sr-only">
                Are you absolutely sure?
              </DialogTitle>
              <DialogDescription className="sr-only">
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <div className="relative">
              <Image
                src={cert.image || "/empty-img.webp"}
                alt={`certificate-${cert.title}-full`}
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
  );
};

export default CertificatePreviewCard;
