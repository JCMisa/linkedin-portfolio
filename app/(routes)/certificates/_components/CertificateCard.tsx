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

const CertificateCard = ({
  cert,
  currentUser,
}: {
  cert: CertificateType;
  currentUser: UserType;
}) => {
  return (
    <div className="flex w-full flex-col space-y-6 rounded-lg bg-neutral-200 dark:bg-dark/80 p-3">
      {/* header view and actions */}
      <div className="w-full flex items-center justify-between gap-4">
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

        {currentUser && currentUser.role === "admin" && (
          <div className="flex items-center gap-2">
            <EditCertificate certificate={cert} />
            <DeleteCertificate certificate={cert} />
          </div>
        )}
      </div>

      {/* image */}
      <Image
        src={cert.image || "/empty-img.webp"}
        alt="certificate"
        width={1000}
        height={1000}
        className="w-full max-h-60 object-cover object-top rounded-lg"
      />

      {/* info */}
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center justify-between gap-2 w-full">
          <p className="text-lg font-bold tracking-wider truncate">
            {cert.title}
          </p>
          <span className="text-sm text-muted-foreground truncate">
            {cert &&
              cert.acquiredDate &&
              cert.acquiredDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
          </span>
        </div>

        <p className="text-xs text-muted-foreground w-full">
          {cert.description}
        </p>
      </div>
    </div>
  );
};

export default CertificateCard;
