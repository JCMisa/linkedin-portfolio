import { Metadata } from "next";
import ProfileSection from "./_components/_profile/ProfileSection";
import ProfessionalActivities from "./_components/_activity/ProfessionalActivities";
import ProjectsFeed from "./_components/_feed/ProjectsFeed";
import CertificatesPreview from "./_components/_activity/CertificatesPreview";
import Footer from "@/components/custom/Footer";
import { getCurrentUser } from "@/lib/actions/users";
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
          url: `${siteUrl}/og/logo.png`, // 1200×630, < 500 kB
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
      types: {
        "application/pdf": `${siteUrl}/Resume-IT.pdf`,
      },
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
  const [currentUser, initialProjects] = await Promise.all([
    getCurrentUser(),
    getProjectsPaginated({ limit: 5 }), // first 5 projects
  ]);

  const userRole = currentUser && currentUser.role ? currentUser.role : "user";

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
