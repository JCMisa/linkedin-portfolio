import CertificatesPreview from "@/features/certificates/components/CertificatesPreview";
import ProfileCard from "@/features/profile/components/ProfileCard";
import Footer from "@/components/layout/Footer";
import CertificatesList from "@/features/certificates/components/CertificatesList";
import { Metadata } from "next";
import { PersonalInfoType } from "@/db/schema";
import { getPersonalInfo } from "@/features/profile/queries";

import { getAllCertificates } from "@/features/certificates/queries";
import { getSessionUser } from "@/lib/auth";
import { env } from "@/lib/env";
export async function generateMetadata(): Promise<Metadata> {
  const title = "Certificates";

  const description =
    "Verified credentials of John Carlo Misa: Introduction to AWS, Google Gemini API Developer Skill Badge, " +
    "Cisco Networking Devices & Configuration, GreatStack React Certificate, 12th IT Skills Olympics participant, " +
    "and more. Download badges, view issuance dates, verify authenticity, and explore learning paths. " +
    "Cloud, AI, networking, and modern web development certifications showcased.";

  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

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
  const [currentUser, certificates, personalInfo] = await Promise.all([
    getSessionUser(),
    getAllCertificates(),
    getPersonalInfo(),
  ]);

  return (
    <main className="relative px-6 py-18 md:px-10 lg:px-16">
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
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
