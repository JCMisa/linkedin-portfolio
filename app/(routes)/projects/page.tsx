import CertificatesPreview from "@/app/_components/_activity/CertificatesPreview";
import ProfileCard from "@/app/_components/_profile/ProfileCard";
import Footer from "@/components/custom/Footer";
import ProjectsList from "./_components/ProjectsList";
import { getCurrentUser } from "@/lib/actions/users";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Projects";

  const description =
    "Explore 20+ shipped projects by John Carlo Misa: AI-powered LMS, real-time code editors, " +
    "virtual health assistants, SaaS applications, automation bots, and business dashboards. " +
    "Built with Next.js, TypeScript, .NET, Neon/Drizzle, AWS, Convex, Gemini API, React Native, Python, Vapi, etc. " +
    "Freelance software development, virtual assistance, and end-to-end digital solutions. " +
    "Case studies, live demos, GitHub repos, and client results included.";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://jcm-portfolio.vercel.app";

  return {
    title,
    description,
    authors: [{ name: "John Carlo Misa", url: siteUrl }],
    creator: "John Carlo Misa",
    publisher: "John Carlo Misa",
    keywords: [
      "John Carlo Misa projects",
      "Next.js portfolio projects",
      "React Native mobile apps",
      "AI LMS project",
      "real-time code editor",
      "virtual health assistant",
      "CogniCare AI",
      "TechTrail LMS",
      "Zeno code editor",
      "Gemini API projects",
      "Convex real-time app",
      "Neon Drizzle ORM",
      ".NET Web API samples",
      "AWS serverless projects",
      "virtual assistant websites",
      "automation bots",
      "e-commerce Next.js",
      "business dashboards",
      "freelance software projects",
      "Philippines developer projects",
      "open-source GitHub",
      "live demo projects",
      "case study portfolio",
      "client project showcase",
      "full-stack project examples",
    ],
    openGraph: {
      title,
      description,
      url: `${siteUrl}/projects`,
      siteName: "John Carlo Misa – Projects Showcase",
      images: [
        {
          url: `${siteUrl}/og/logo.png`, // 1200×630, < 500 kB
          width: 1200,
          height: 630,
          alt: "Grid of John Carlo Misa’s flagship software, mobile, and VA projects",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@jcmisa_dev",
      creator: "@jcmisa_dev",
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
      canonical: `${siteUrl}/projects`,
    },
    manifest: "/site.webmanifest",
    other: {
      "msapplication-TileColor": "#0f172a",
      "theme-color": "#0f172a",
      "github:repositories": "https://github.com/JCMisa?tab=repositories",
    },
  };
}

const ProjectsPage = async () => {
  const [currentUser] = await Promise.all([getCurrentUser()]);

  return (
    <main className="relative py-18 px-6 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row gap-6">
        {/* projects list */}
        <ProjectsList currentUser={currentUser} />

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
      </div>
    </main>
  );
};

export default ProjectsPage;
