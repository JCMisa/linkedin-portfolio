import { pageMetadata } from "@/lib/seo";
import CertificatesPreview from "@/features/certificates/components/CertificatesPreview";
import ProfileCard from "@/features/profile/components/ProfileCard";
import Footer from "@/components/layout/Footer";
import ProjectsList from "@/features/projects/components/ProjectsList";
import type { Metadata } from "next";
import { getPersonalInfo } from "@/features/profile/queries";
import { PersonalInfoType } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Projects by John Carlo Misa: an AI-powered LMS, a real-time code editor, a health assistant and more, built with Next.js, TypeScript, .NET, AWS and Gemini.",
  path: "/projects",
  keywords: [
    "John Carlo Misa projects",
    "Next.js projects",
    "AI web apps",
    "full-stack portfolio",
    "React Native apps",
    "open source",
  ],
});

const ProjectsPage = async () => {
  const [currentUser, personalInfo] = await Promise.all([
    getSessionUser(),
    getPersonalInfo(),
  ]);

  return (
    <main className="relative px-6 py-18 md:px-10 lg:px-16">
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        {/* projects list */}
        <ProjectsList
          userRole={currentUser?.role ?? "user"}
          personalInfo={personalInfo as PersonalInfoType}
        />

        {/* profile and latest certificates and footer - fixed */}
        <div className="flex w-full flex-col gap-2 rounded-lg lg:w-[320px]">
          <ProfileCard personalInfo={personalInfo as PersonalInfoType} />

          <div className="sticky top-[73px]">
            <CertificatesPreview />
            <div className="mt-4">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProjectsPage;
