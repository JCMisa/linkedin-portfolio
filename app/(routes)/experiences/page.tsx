import ProfessionalActivities from "@/app/_components/_activity/ProfessionalActivities";
import ProfileCard from "@/app/_components/_profile/ProfileCard";
import Footer from "@/components/custom/Footer";
import { Metadata } from "next";
import { getPersonalInfo } from "@/lib/actions/profileInfo";
import { getCurrentUser } from "@/lib/actions/users";
import ExperienceList from "./_components/ExperienceList";
import { PersonalInfoType } from "@/config/schema";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Experience";

  const description =
    "Interactive timeline of John Carlo Misa’s professional journey: full-stack/AI Developer & Virtual Assistant, " +
    "Multiple apps delivered, 90% client retention. " +
    "From Canossa College ABM to Laguna State Polytechnic University IT graduate, " +
    "AWS certified, Google Gemini certified, Cisco networking graduate. " +
    "Freelance milestones, open-source contributions, certificates, and client success stories in chronological order.";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://jcm-portfolio.vercel.app";

  return {
    title,
    description,
    authors: [{ name: "John Carlo Misa", url: siteUrl }],
    creator: "John Carlo Misa",
    publisher: "John Carlo Misa",
    keywords: [
      "John Carlo Misa experience",
      "freelance developer timeline",
      "career milestones",
      "Laguna State Polytechnic University",
      "Canossa College ABM",
      "AWS certified timeline",
      "Google Gemini API certified",
      "Cisco Networking Academy",
      "GreatStack React certificate",
      "12th IT Skills Olympics",
      "freelance web developer 2021",
      "full-stack engineer Philippines",
      "90 % client retention",
      "hackathon winner history",
      "open-source contributions timeline",
      "Next.js projects evolution",
      "React Native apps delivered",
      ".NET Web API experience",
      "Neon Drizzle ORM usage",
      "serverless AWS journey",
      "professional certificates chronology",
      "career progression portfolio",
      "San Pablo developer timeline",
      "Philippines tech freelancer",
    ],
    openGraph: {
      title,
      description,
      url: `${siteUrl}/experiences`,
      siteName: "John Carlo Misa – Experience Timeline",
      images: [
        {
          url: `${siteUrl}/og/logo.png`, // 1200×630, < 500 kB
          width: 1200,
          height: 630,
          alt: "Interactive timeline of John Carlo Misa’s career and experiences",
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
      canonical: `${siteUrl}/experience`,
      types: {
        "application/pdf": `${siteUrl}/Resume-IT.pdf`,
      },
    },
    manifest: "/site.webmanifest",
    other: {
      "msapplication-TileColor": "#0f172a",
      "theme-color": "#0f172a",
      "resume:pdf": `${siteUrl}/Resume-IT.pdf`,
      "linkedin:profile":
        "https://www.linkedin.com/in/john-carlo-misa-80a1b5208",
      "certificates:gallery": `${siteUrl}/certificates`,
    },
  };
}

const ExperiencesPage = async () => {
  const [personalInfo, currentUser] = await Promise.all([
    getPersonalInfo(),
    getCurrentUser(),
  ]);

  let experiences: any[] = [];

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
    <main className="relative py-18 px-6 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row gap-6">
        {/* experiences timeline */}
        <div className="relative w-full overflow-clip rounded-lg">
          <ExperienceList
            initialExperiences={experiences}
            userRole={currentUser?.role}
          />
        </div>

        {/* profile and latest certificates and footer - fixed */}
        <div className="w-full lg:w-[320px] rounded-lg flex flex-col gap-2">
          <ProfileCard personalInfo={personalInfo as PersonalInfoType} />

          <div className="sticky top-[73px]">
            <ProfessionalActivities
              personalInfo={personalInfo as PersonalInfoType}
            />
            <div className="mt-4">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ExperiencesPage;
