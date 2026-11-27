import { pageMetadata } from "@/lib/seo";
import ProfessionalActivities from "@/features/profile/components/experience/ProfessionalActivities";
import ProfileCard from "@/features/profile/components/ProfileCard";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";
import { getPersonalInfo } from "@/features/profile/queries";
import ExperienceList from "@/features/profile/components/experience/ExperienceList";
import { PersonalInfoType } from "@/db/schema";

import type { ExperiencesType } from "@/db/schema";
export const metadata: Metadata = pageMetadata({
  title: "Experience",
  description:
    "Career timeline of John Carlo Misa: freelance full-stack and AI development, virtual assistance, education and key milestones along the way.",
  path: "/experiences",
  keywords: [
    "John Carlo Misa experience",
    "full-stack developer career",
    "freelance developer",
    "virtual assistant",
    "Laguna State Polytechnic University",
  ],
});

const ExperiencesPage = async () => {
  const personalInfo = await getPersonalInfo();

  let experiences: ExperiencesType[] = [];

  if (
    personalInfo &&
    typeof personalInfo === "object" &&
    "id" in personalInfo
  ) {
    const info = personalInfo as PersonalInfoType;
    if (info.experiences && Array.isArray(info.experiences)) {
      experiences = info.experiences;
    }
  }

  return (
    <main id="main-content" className="relative px-6 py-18 md:px-10 lg:px-16">
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        {/* experiences timeline */}
        <div className="relative w-full overflow-clip rounded-lg">
          <ExperienceList initialExperiences={experiences} />
        </div>

        {/* profile and latest certificates and footer - fixed */}
        <aside
          aria-label="Sidebar"
          className="flex w-full flex-col gap-2 rounded-lg lg:w-[320px]"
        >
          <ProfileCard personalInfo={personalInfo as PersonalInfoType} />

          <div className="sticky top-[73px]">
            <ProfessionalActivities
              personalInfo={personalInfo as PersonalInfoType}
            />
            <div className="mt-4">
              <Footer />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default ExperiencesPage;
