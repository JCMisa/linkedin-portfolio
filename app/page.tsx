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
import { Suspense } from "react";
import ProjectCardSkeleton from "@/features/projects/components/ProjectCardSkeleton";

// Title, description and share image come from the root layout defaults
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const personalInfo = await getPersonalInfo();

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
            <Suspense fallback={<FeedSkeleton />}>
              <HomeFeed personalInfo={personalInfo as PersonalInfoType} />
            </Suspense>
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

/**
 * The first feed page includes "liked by me", so it reads the session and
 * streams in at request time; the rest of the page is in the static shell.
 */
async function HomeFeed({ personalInfo }: { personalInfo: PersonalInfoType }) {
  const viewer = await getSessionUser();
  const initialPage = await getProjectsPage({ limit: 5 }, viewer?.id ?? null);
  return <ProjectsFeed initialPage={initialPage} personalInfo={personalInfo} />;
}

function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
    </div>
  );
}
