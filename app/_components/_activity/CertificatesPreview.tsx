import CreateCertificate from "@/components/custom/CreateCertificate";

import { getLatestThreeCertificates } from "@/lib/actions/certificates";
import { getCurrentUser } from "@/lib/actions/users";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import CertificatePreviewCard from "./CertificatePreviewCard";
import { CertificateSkeletonCard } from "./CertificateSkeletonCard";

const CertificatesPreview = async () => {
  const [currentUser, { data: latestCertificates }] = await Promise.all([
    getCurrentUser(),
    getLatestThreeCertificates(),
  ]);

  return (
    <div className="h-[394px] w-full dark:bg-dark flex flex-col items-start gap-4 rounded-lg p-3 overflow-x-hidden overflow-y-auto no-scrollbar">
      {/* header */}
      <div className="flex items-center w-full gap-2 justify-between">
        <h2 className="font-bold text-md">Proof in Paper</h2>

        {currentUser && currentUser.role === "admin" && (
          <div className="flex items-center gap-2">
            <CreateCertificate />
          </div>
        )}
      </div>

      {/* certifications list */}
      <div className="flex flex-col items-start gap-2 w-full">
        {latestCertificates && latestCertificates.length > 0
          ? latestCertificates.map((cert: CertificateType) => (
              <CertificatePreviewCard key={cert.id} cert={cert} />
            ))
          : [1, 2, 3].map((item) => <CertificateSkeletonCard key={item} />)}
      </div>

      <Link
        href={"/certificates"}
        className="w-full px-4 flex items-center gap-1"
      >
        <p className="text-xs leading-[16px]">View All Certificates</p>
        <ArrowRightIcon className="size-3" />
      </Link>
    </div>
  );
};

export default CertificatesPreview;
