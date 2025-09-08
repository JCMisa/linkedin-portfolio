import CertificatesPreview from "@/app/_components/_activity/CertificatesPreview";
import ProfileCard from "@/app/_components/_profile/ProfileCard";
import Footer from "@/components/custom/Footer";
import CertificatesList from "./_components/CertificatesList";
import { getCurrentUser } from "@/lib/actions/users";
import { getAllCertificates } from "@/lib/actions/certificates";

const CertificatesPage = async () => {
  const [currentUser, { data: certificates }] = await Promise.all([
    getCurrentUser(),
    getAllCertificates(),
  ]);

  return (
    <main className="relative py-18 px-6 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row gap-6">
        {/* profile and latest certificates and footer - fixed */}
        <div className="w-full lg:w-[320px] rounded-lg flex flex-col gap-2">
          <ProfileCard />

          <div className="sticky top-[73px]">
            <CertificatesPreview />
            <div className="mt-4">
              <Footer />
            </div>
          </div>
        </div>

        {/* certificates list */}
        <CertificatesList
          currentUser={currentUser}
          certificates={certificates ? certificates : []}
        />
      </div>
    </main>
  );
};

export default CertificatesPage;
