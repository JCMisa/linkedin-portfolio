import { pageMetadata } from "@/lib/seo";
import CertificatesPreview from "@/features/certificates/components/CertificatesPreview";
import ProfileCard from "@/features/profile/components/ProfileCard";
import Footer from "@/components/layout/Footer";
import CertificatesList from "@/features/certificates/components/CertificatesList";
import type { Metadata } from "next";
import { PersonalInfoType } from "@/db/schema";
import { getPersonalInfo } from "@/features/profile/queries";

import { getAllCertificates } from "@/features/certificates/queries";
export const metadata: Metadata = pageMetadata({
  title: "Certificates",
  description:
    "Certifications earned by John Carlo Misa, including AWS, Google Gemini API, Cisco Networking and React, with issue dates and verification links.",
  path: "/certificates",
  keywords: [
    "John Carlo Misa certificates",
    "AWS certification",
    "Google Gemini API badge",
    "Cisco Networking Academy",
    "React certificate",
  ],
});

const CertificatesPage = async () => {
  const [certificates, personalInfo] = await Promise.all([
    getAllCertificates(),
    getPersonalInfo(),
  ]);

  return (
    <main id="main-content" className="relative px-6 py-18 md:px-10 lg:px-16">
      <h1 className="sr-only">Certificates</h1>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        {/* profile and latest certificates and footer - fixed */}
        <aside
          aria-label="Sidebar"
          className="flex w-full flex-col gap-2 rounded-lg lg:w-[320px]"
        >
          <ProfileCard personalInfo={personalInfo as PersonalInfoType} />

          <div className="sticky top-[73px]">
            <CertificatesPreview />
            <div className="mt-4">
              <Footer />
            </div>
          </div>
        </aside>

        {/* certificates list */}
        <CertificatesList certificates={certificates ? certificates : []} />
      </div>
    </main>
  );
};

export default CertificatesPage;
