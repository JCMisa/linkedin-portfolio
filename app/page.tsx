import { Metadata } from "next";
import ProfileSection from "./_components/_profile/ProfileSection";
import ProfessionalActivities from "./_components/_activity/ProfessionalActivities";
import ProjectsFeed from "./_components/_feed/ProjectsFeed";
import CertificatesPreview from "./_components/_activity/CertificatesPreview";
import Footer from "@/components/custom/Footer";

export const metadata: Metadata = {
  title: "Feed | JCM",
  description: "Feed page of my portfolio where my projects posts can be seen.",
};

export default function Home() {
  return (
    <main className="relative py-14 lg:py-18 px-6 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto relative">
        {/* profile - fixed */}
        <div className="hidden lg:block fixed w-[240px] rounded-lg ">
          <ProfileSection />
        </div>

        {/* feed/projects */}
        <div className="flex flex-col lg:flex-row gap-6 py-5 lg:py-0 lg:pl-[265px]">
          {/* posts / projects  */}
          <div className="w-full lg:max-w-[640px] rounded-lg">
            <ProjectsFeed />
          </div>

          {/* activities */}
          <div className="w-full lg:w-[320px] rounded-lg flex flex-col gap-2">
            <ProfessionalActivities />

            <div className="sticky top-[73px]">
              <CertificatesPreview />
              <div className="mt-4">
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
