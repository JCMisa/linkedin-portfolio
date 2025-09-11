import CertificatesPreview from "@/app/_components/_activity/CertificatesPreview";
import Footer from "@/components/custom/Footer";
import ProfileLeftInfo from "./_components/ProfileLeftInfo";
import { getAllUsers, getCurrentUser } from "@/lib/actions/users";
import { getAllLikes } from "@/lib/actions/likes";
import { getAllComments } from "@/lib/actions/comments";
import { Metadata } from "next";
import { getAllProjects } from "@/lib/actions/projects";
import PreferenceAndProfileLink from "./_components/PreferenceAndProfileLink";
import DownloadResumeMobile from "./_components/DownloadResumeMobile";

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

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://jcm-portfolio.vercel.app";

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
    allUsers,
    numberOfPostLikes,
    numberOfPostComments,
    projects,
  ] = await Promise.all([
    getCurrentUser(),
    getAllUsers(),
    getAllLikes(),
    getAllComments(),
    getAllProjects(),
  ]);

  let latestProject1;
  let latestProject2;

  if (projects && projects.success && projects.data) {
    latestProject1 = projects.data[0];
    latestProject2 = projects.data[1];
  }

  return (
    <main className="relative py-18 px-6 md:px-10 lg:px-16 ">
      <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row gap-6">
        {/* left info */}
        <ProfileLeftInfo
          numberOfUsers={allUsers.length || 0}
          numberOfPostLikes={numberOfPostLikes.data?.length || 0}
          numberOfPostComments={numberOfPostComments.data?.length || 0}
          latestProject1={latestProject1 as ProjectType}
          latestProject2={latestProject2 as ProjectType}
          userRole={currentUser ? currentUser.role : "user"}
        />

        {/* right info */}
        <div className="w-full lg:w-[320px] rounded-lg flex flex-col gap-2">
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
