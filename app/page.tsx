import { Metadata } from "next";
import ProfileSection from "./_components/_profile/ProfileSection";
import ProfessionalActivities from "./_components/_activity/ProfessionalActivities";
import ProjectsFeed from "./_components/_feed/ProjectsFeed";
import CertificatesPreview from "./_components/_activity/CertificatesPreview";
import Footer from "@/components/custom/Footer";
import { getUserRole } from "@/lib/actions/users";
import { getProjectsPaginated } from "@/lib/actions/projects";

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
      "Portfolio",
      "portfolio",
      "e-portfolio",
      "website portfolio",
      "modern portfolio",
      "Next.js portfolio",
      "React TypeScript projects",
      "full-stack engineer",
      "full-stack developer",
      "full-stack development",
      "cloud architect",
      "serverless",
      "serverless database",
      "drizzle orm",
      "orm",
      "AWS solutions",
      "open-source contributor",
      "software engineer portfolio",
      "certified solutions architect",
      "software development",
      "software",
      "website",
      "ai",
      "AI",
      "website development",
      "feed",
      "linkedin",
      "Linkedin",
      "linkedin portfolio",
      "linkedin design",
      "linkedin portfolio design",
      "linkedin feed",
    ],
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: "John Carlo Misa – Portfolio & Feed",
      images: [
        {
          url: `${siteUrl}/og/feed.png`, // 1200×630, < 500 kB
          width: 1200,
          height: 630,
          alt: "Preview of latest projects and certificates",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@jcmisa_dev", // your Twitter handle
      title,
      description,
      images: [`${siteUrl}/og/feed.png`],
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
    },
  };
}

export default async function Home() {
  const [userRole, initialProjects] = await Promise.all([
    getUserRole(),
    getProjectsPaginated({ limit: 5 }), // first 5 projects
  ]);

  return (
    <main className="relative py-14 lg:py-18 px-6 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto relative">
        <div className="hidden lg:block fixed w-[240px] rounded-lg">
          <ProfileSection />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 py-5 lg:py-0 lg:pl-[265px]">
          <div className="w-full lg:max-w-[640px] rounded-lg">
            <ProjectsFeed
              userRole={userRole}
              initialProjects={initialProjects.data ?? []}
              initialCursor={initialProjects.nextCursor ?? undefined}
              initialHasMore={!!initialProjects.nextCursor}
            />
          </div>

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
