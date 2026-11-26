import { CertificateFormDialog } from "./admin-dialogs";

import { ArrowRightIcon, AwardIcon } from "lucide-react";
import Link from "next/link";
import CertificatePreviewCard from "./CertificatePreviewCard";

import { getLatestCertificates } from "@/features/certificates/queries";
import { getSessionUser } from "@/lib/auth";
import { EmptyState } from "@/components/shared/EmptyState";
const CertificatesPreview = async () => {
  const [currentUser, latestCertificates] = await Promise.all([
    getSessionUser(),
    getLatestCertificates(3),
  ]);

  return (
    <div className="no-scrollbar flex h-[394px] w-full flex-col items-start gap-4 overflow-x-hidden overflow-y-auto rounded-lg bg-card p-3">
      {/* header */}
      <div className="flex w-full items-center justify-between gap-2">
        <h2 className="text-md font-bold">Proof in Paper</h2>

        {currentUser && currentUser.role === "admin" && (
          <div className="flex items-center gap-2">
            <CertificateFormDialog />
          </div>
        )}
      </div>

      {/* certifications list */}
      <div className="flex w-full flex-col items-start gap-2">
        {latestCertificates && latestCertificates.length > 0 ? (
          latestCertificates.map((cert) => (
            <CertificatePreviewCard key={cert.id} cert={cert} />
          ))
        ) : (
          <EmptyState
            size="compact"
            icon={AwardIcon}
            title="No certificates yet"
          />
        )}
      </div>

      <Link
        href={"/certificates"}
        className="flex w-full items-center gap-1 px-4"
      >
        <p className="text-xs leading-[16px]">View all certificates</p>
        <ArrowRightIcon className="size-3" />
      </Link>
    </div>
  );
};

export default CertificatesPreview;
