import CreateCertificate from "./CreateCertificate";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import CertificatePreviewCard from "./CertificatePreviewCard";
import { CertificatePreviewSkeleton } from "./CertificatePreviewSkeleton";

import { getLatestThreeCertificates } from "@/features/certificates/queries";
import { getSessionUser } from "@/lib/auth";
const CertificatesPreview = async () => {
  const [currentUser, { data: latestCertificates }] = await Promise.all([
    getSessionUser(),
    getLatestThreeCertificates(),
  ]);

  return (
    <div className="no-scrollbar flex h-[394px] w-full flex-col items-start gap-4 overflow-x-hidden overflow-y-auto rounded-lg bg-neutral-100 p-3 dark:bg-dark">
      {/* header */}
      <div className="flex w-full items-center justify-between gap-2">
        <h2 className="text-md font-bold">Proof in Paper</h2>

        {currentUser && currentUser.role === "admin" && (
          <div className="flex items-center gap-2">
            <CreateCertificate />
          </div>
        )}
      </div>

      {/* certifications list */}
      <div className="flex w-full flex-col items-start gap-2">
        {latestCertificates && latestCertificates.length > 0
          ? latestCertificates.map((cert: CertificateType) => (
              <CertificatePreviewCard key={cert.id} cert={cert} />
            ))
          : [1, 2, 3].map((item) => <CertificatePreviewSkeleton key={item} />)}
      </div>

      <Link
        href={"/certificates"}
        className="flex w-full items-center gap-1 px-4"
      >
        <p className="text-xs leading-[16px]">View All Certificates</p>
        <ArrowRightIcon className="size-3" />
      </Link>
    </div>
  );
};

export default CertificatesPreview;
