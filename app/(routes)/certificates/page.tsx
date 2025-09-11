import CertificatesPreview from "@/app/_components/_activity/CertificatesPreview";
import ProfileCard from "@/app/_components/_profile/ProfileCard";
import Footer from "@/components/custom/Footer";
import CertificatesList from "./_components/CertificatesList";
import { getCurrentUser } from "@/lib/actions/users";
import { getAllCertificates } from "@/lib/actions/certificates";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Certificates";

  const description =
    "Verified credentials of John Carlo Misa: Introduction to AWS, Google Gemini API Developer Skill Badge, " +
    "Cisco Networking Devices & Configuration, GreatStack React Certificate, 12th IT Skills Olympics participant, " +
    "and more. Download badges, view issuance dates, verify authenticity, and explore learning paths. " +
    "Cloud, AI, networking, and modern web development certifications showcased.";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://jcm-portfolio.vercel.app";

  return {
    title,
    description,
    authors: [{ name: "John Carlo Misa", url: siteUrl }],
    creator: "John Carlo Misa",
    publisher: "John Carlo Misa",
    keywords: [
      "John Carlo Misa certificates",
      "AWS certified developer",
      "Google Gemini API badge",
      "Cisco Networking Academy certificate",
      "GreatStack React certificate",
      "IT Skills Olympics Philippines",
      "AWS Solutions Architect",
      "Google Developer Skill Badge",
      "verify AWS certification",
      "Cisco networking certificate",
      "cloud certifications Philippines",
      "AI ML badges",
      "full-stack certificates",
      "React JavaScript credentials",
      "networking fundamentals",
      "certification timeline",
      "download digital badges",
      "credential verification",
      "Laguna State Polytechnic University",
      "San Pablo developer certs",
      "cert portfolio showcase",
      "AWS badge verification link",
      "Google credential URL",
      "Cisco certificate validation",
    ],
    openGraph: {
      title,
      description,
      url: `${siteUrl}/certificates`,
      siteName: "John Carlo Misa – Certificates & Badges",
      images: [
        {
          url: `${siteUrl}/og/logo.png`, // 1200×630, < 500 kB
          width: 1200,
          height: 630,
          alt: "Collage of professional and university certificates earned by John Carlo Misa",
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
      canonical: `${siteUrl}/certificates`,
    },
    manifest: "/site.webmanifest",
    other: {
      "msapplication-TileColor": "#0f172a",
      "theme-color": "#0f172a",
      "google:profile": "https://g.dev/johncarlomisa",
      "credly:profile": "https://www.credly.com/users/misa-john-carlo",
    },
  };
}

const CertificatesPage = async () => {
  const [currentUser, { data: certificates }] = await Promise.all([
    getCurrentUser(),
    getAllCertificates(),
  ]);

  return (
    <main className="relative py-18 px-6 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row gap-6">
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

        {/* certificates list */}
        <CertificatesList
          currentUser={currentUser}
          certificates={certificates ? certificates : []}
        />
      </div>
    </main>
  );
};

export default CertificatesPage;
