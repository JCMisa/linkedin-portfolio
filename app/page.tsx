import { JsonLd } from "@/components/shared/JsonLd";
import { personJsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import ProfileSection from "@/features/profile/components/ProfileSection";
import ProfessionalActivities from "@/features/profile/components/experience/ProfessionalActivities";
import ProjectsFeed from "@/features/projects/components/ProjectsFeed";
import CertificatesPreview from "@/features/certificates/components/CertificatesPreview";
import Footer from "@/components/layout/Footer";
import { getProjectsPage } from "@/features/projects/queries";
import { MarketNewsWidget } from "@/components/shared/MarketNewsWidget";
import { getPersonalInfo } from "@/features/profile/queries";
import { PersonalInfoType } from "@/db/schema";

import { getSessionUser } from "@/lib/auth";

// Title, description and share image come from the root layout defaults
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const currentUser = await getSessionUser();
  const [initialPage, personalInfo] = await Promise.all([
    getProjectsPage({ limit: 5 }, currentUser?.id ?? null), // first 5 projects
    getPersonalInfo(),
  ]);

  const userRole = currentUser && currentUser.role ? currentUser.role : "user";

  return (
    <main
      id="main-content"
      className="relative px-6 py-14 md:px-10 lg:px-16 lg:py-18"
    >
      <JsonLd data={personJsonLd()} />
      <h1 className="sr-only">John Carlo Misa: projects feed</h1>
      <div className="relative mx-auto max-w-7xl">
        <aside
          aria-label="Profile summary"
          className="fixed hidden w-[240px] rounded-lg lg:block"
        >
          <ProfileSection personalInfo={personalInfo as PersonalInfoType} />
        </aside>

        <div className="flex flex-col gap-6 py-5 lg:flex-row lg:py-0 lg:pl-[265px]">
          <div className="w-full rounded-lg lg:max-w-[640px]">
            <ProjectsFeed
              userRole={userRole}
              initialPage={initialPage}
              personalInfo={personalInfo as PersonalInfoType}
            />
          </div>

          <aside
            aria-label="Activity and certificates"
            className="flex w-full flex-col gap-2 rounded-lg lg:w-[320px]"
          >
            <ProfessionalActivities
              personalInfo={personalInfo as PersonalInfoType}
            />
            <MarketNewsWidget />
            <div className="sticky top-[73px]">
              <CertificatesPreview />
              <div className="mt-4">
                <Footer />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
