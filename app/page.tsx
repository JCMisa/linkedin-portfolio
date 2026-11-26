import { Metadata } from "next";
import ProfileSection from "@/features/profile/components/ProfileSection";
import ProfessionalActivities from "@/features/profile/components/experience/ProfessionalActivities";
import ProjectsFeed from "@/features/projects/components/ProjectsFeed";
import CertificatesPreview from "@/features/certificates/components/CertificatesPreview";
import Footer from "@/components/layout/Footer";
import { getProjectsPaginated } from "@/features/projects/actions/projects";
import { MarketNewsWidget } from "@/components/shared/MarketNewsWidget";
import { getPersonalInfo } from "@/features/profile/actions";
import { PersonalInfoType } from "@/db/schema";
import { OptimizedProject } from "@/features/projects/types";

import { getSessionUser } from "@/lib/auth";
export async function generateMetadata(): Promise<Metadata> {
  const title = "Feed | JCM Portfolio";
  const description =
    "Explore real-world projects, open-source contributions, and professional certificates " +
    "built with Next.js, TypeScript, Javascript, Tailwindcss, AWS, Serverless database (Neon), Drizzle ORM, .NET Web API, FastAPI (Modal), with modern cloud and software developer tools.";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://jcm-portfolio.vercel.app";

  return {
    title,
    description,
    authors: [{ name: "John Carlo Misa", url: siteUrl }],
    creator: "John Carlo Misa",
    publisher: "John Carlo Misa",
    keywords: [
      "portfolio",
      "ai",
      "linkedin portfolio",
      "full-stack developer portfolio",
      "Next.js TypeScript projects",
      "AWS serverless architect",
      "Neon Drizzle ORM",
      "open-source contributor",
      "certified solutions architect",
      "React Tailwind portfolio",
      "Modal FastAPI",
      ".NET Web API",
    ],
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: "John Carlo Misa – Portfolio & Feed",
      images: [
        {
          url: `${siteUrl}/og/logo.png`,
          width: 1200,
          height: 630,
          alt: "Preview",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@jcmisa_dev",
      title,
      description,
      images: [`${siteUrl}/og/logo.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: siteUrl,
      types: { "application/pdf": `${siteUrl}/Resume-IT.pdf` },
    },
    manifest: "/site.webmanifest",
    other: {
      "msapplication-TileColor": "#0f172a",
      "theme-color": "#0f172a",
      "linkedin:profile":
        "https://www.linkedin.com/in/john-carlo-misa-80a1b5208",
      "github:username": "JCMisa",
      "resume:pdf": `${siteUrl}/Resume-IT.pdf`,
    },
  };
}

export default async function Home() {
  const [currentUser, initialProjects, personalInfo] = await Promise.all([
    getSessionUser(),
    getProjectsPaginated({ limit: 5 }), // first 5 projects
    getPersonalInfo(),
  ]);

  // Handle the type cast here so the data passed to ProjectsFeed is correct
  const typedProjects = (initialProjects.data ??
    []) as unknown as OptimizedProject[];

  const userRole = currentUser && currentUser.role ? currentUser.role : "user";

  return (
    <main className="relative px-6 py-14 md:px-10 lg:px-16 lg:py-18">
      <div className="relative mx-auto max-w-7xl">
        <div className="fixed hidden w-[240px] rounded-lg lg:block">
          <ProfileSection personalInfo={personalInfo as PersonalInfoType} />
        </div>

        <div className="flex flex-col gap-6 py-5 lg:flex-row lg:py-0 lg:pl-[265px]">
          <div className="w-full rounded-lg lg:max-w-[640px]">
            <ProjectsFeed
              userRole={userRole}
              initialProjects={typedProjects}
              initialCursor={initialProjects.nextCursor ?? undefined}
              initialHasMore={!!initialProjects.nextCursor}
              personalInfo={personalInfo as PersonalInfoType}
            />
          </div>

          <div className="flex w-full flex-col gap-2 rounded-lg lg:w-[320px]">
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
          </div>
        </div>
      </div>
    </main>
  );
}
