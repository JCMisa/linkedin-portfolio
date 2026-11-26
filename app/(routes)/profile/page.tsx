import CertificatesPreview from "@/features/certificates/components/CertificatesPreview";
import Footer from "@/components/layout/Footer";
import ProfileLeftInfo from "@/features/profile/components/ProfileLeftInfo";
import { Metadata } from "next";
import PreferenceAndProfileLink from "@/features/profile/components/PreferenceAndProfileLink";
import DownloadResumeMobile from "@/features/profile/components/DownloadResumeMobile";

import {
  getLatestProjects,
  getLikeCount,
  getCommentCount,
} from "@/features/projects/queries";
import { getUserCount } from "@/features/users/queries";
import { getSessionUser } from "@/lib/auth";
import { env } from "@/lib/env";
export async function generateMetadata(): Promise<Metadata> {
  const title = "Profile";

  const description =
    "John Carlo Misa – AWS-certified full-stack developer, freelancer, " +
    "Multiple responsive web/mobile apps shipped. " +
    "Expert in Next.js, TypeScript, .NET Web API, Neon/Drizzle, Clerk Auth, React Native. " +
    "Built AI-powered systems. " +
    "Google Gemini API certified, Cisco networking, GreatStack React graduate, etc. " +
    "San Pablo City, Laguna, Philippines. Open-source contributor, 90% client retention, 99% uptime. " +
    "View resume, testimonials, education, and flagship projects.";

  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  return {
    title,
    description,
    authors: [{ name: "John Carlo Misa", url: siteUrl }],
    creator: "John Carlo Misa",
    publisher: "John Carlo Misa",
    keywords: [
      "John Carlo Misa",
      "JC Misa",
      "San Pablo Laguna developer",
      "full-stack engineer Philippines",
      "AWS certified solutions architect",
      "Next.js TypeScript React",
      "React Native mobile developer",
      ".NET Web API C#",
      "Neon PostgreSQL Drizzle ORM",
      "serverless AWS Vercel",
      "AI ML Gemini API",
      "Python Pandas Jupyter",
      "freelance web developer",
      "hackathon winner",
      "open-source maintainer",
      "Google Developer Skill Badge Gemini",
      "Cisco Networking Academy",
      "GreatStack React certificate",
      "Clerk Auth Stripe integration",
      "real-time Convex apps",
      "techtrail lms",
      "zeno code editor",
      "cognicare health assistant",
      "client testimonials",
      "resume CV download",
      "Laguna State Polytechnic University",
      "Canossa College ABM",
      "remote software engineer",
      "Philippines tech portfolio",
    ],
    openGraph: {
      title,
      description,
      url: `${siteUrl}/profile`,
      siteName: "John Carlo Misa – Portfolio & Profile",
      images: [
        {
          url: `${siteUrl}/og/profile.png`, // 1200×630, < 500 kB
          width: 1200,
          height: 630,
          alt: "John Carlo Misa – profile picture, tech stack, and accolades",
        },
      ],
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      site: "@jcmisa_dev",
      creator: "@jcmisa_dev",
      title,
      description,
      images: [`${siteUrl}/og/profile.png`],
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
      canonical: `${siteUrl}/profile`,
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

const ProfilePage = async () => {
  const [
    currentUser,
    numberOfUsers,
    numberOfPostLikes,
    numberOfPostComments,
    projects,
  ] = await Promise.all([
    getSessionUser(),
    getUserCount(),
    getLikeCount(),
    getCommentCount(),
    getLatestProjects(2),
  ]);

  const [latestProject1, latestProject2] = projects;

  return (
    <main className="relative px-6 py-18 md:px-10 lg:px-16">
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 xl:flex-row">
        {/* left info */}
        <ProfileLeftInfo
          numberOfUsers={numberOfUsers}
          numberOfPostLikes={numberOfPostLikes}
          numberOfPostComments={numberOfPostComments}
          latestProject1={latestProject1 as ProjectType}
          latestProject2={latestProject2 as ProjectType}
          userRole={currentUser ? currentUser.role : "user"}
        />

        {/* right info */}
        <div className="flex w-full flex-col gap-2 rounded-lg xl:w-[320px]">
          <PreferenceAndProfileLink />

          <div className="sticky top-[73px]">
            <CertificatesPreview />
            <div className="mt-4">
              <Footer />
            </div>
          </div>
        </div>
      </div>

      <DownloadResumeMobile />
    </main>
  );
};

export default ProfilePage;
