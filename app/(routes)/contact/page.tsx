import { Metadata } from "next";
import SendMessageForm from "@/features/contact/components/SendMessageForm";
import { getPersonalInfo } from "@/features/profile/queries";
import { PersonalInfoType } from "@/db/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { env } from "@/lib/env";
export async function generateMetadata(): Promise<Metadata> {
  const title = "Contact | John Carlo Misa";

  const description =
    "Get in touch with John Carlo Misa – based in San Pablo City, Philippines. " +
    "Book a call, email jcmisa.dev@gmail.com, or DM on LinkedIn/Twitter. " +
    "Freelance web/mobile development, AI integrations, virtual assistance, and more.";

  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  return {
    title,
    description,
    authors: [{ name: "John Carlo Misa", url: siteUrl }],
    creator: "John Carlo Misa",
    publisher: "John Carlo Misa",
    keywords: [
      "John Carlo Misa contact",
      "hire freelance developer Philippines",
      "San Pablo Laguna web developer",
      "Next.js freelancer for hire",
      "React Native app developer",
      "AWS serverless consultant",
      "AI integration services",
      "virtual assistant developer",
      "full-stack engineer hire",
      "freelance quote request",
      "book discovery call",
      "Calendly jcmisa",
      "LinkedIn DM John Carlo Misa",
      "Philippines remote developer",
      "urgent web development",
      "mobile app freelancer",
      "Neon Drizzle ORM expert",
      ".NET Web API contractor",
      "Gemini API integration",
      "Stripe Clerk Auth setup",
      "contact form portfolio",
      "24 hr response guarantee",
    ],
    openGraph: {
      title,
      description,
      url: `${siteUrl}/contact`,
      siteName: "John Carlo Misa – Contact & Booking",
      images: [
        {
          url: `${siteUrl}/og/logo.png`, // 1200×630, < 500 kB
          width: 1200,
          height: 630,
          alt: "Let’s work together – John Carlo Misa contact page",
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
      canonical: `${siteUrl}/contact`,
    },
    manifest: "/site.webmanifest",
    other: {
      "msapplication-TileColor": "#0f172a",
      "theme-color": "#0f172a",
      "email:primary": "jcmisa.dev@gmail.com",
      "phone:ph": "+639071816666",
      "linkedin:message":
        "https://www.linkedin.com/in/john-carlo-misa-80a1b5208",
      "twitter:dm": "https://x.com/jcmisa_dev",
      "whatsapp:chat": "https://wa.me/639071816666",
      "response:time": "24 hours",
      "timezone:manila": "UTC+8",
    },
  };
}

const ContactPage = async () => {
  const personalInfo: PersonalInfoType | null = await getPersonalInfo();

  if (!personalInfo) {
    return null;
  }

  return (
    <main className="min-h-screen bg-muted pt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Side: Map & Contact Info */}
          <div className="space-y-6 lg:w-2/3">
            <div className="relative h-[400px] overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:h-[500px]">
              <iframe
                title="map"
                width="100%"
                height="100%"
                src={`https://maps.google.com/maps?q=${personalInfo.city},${personalInfo.country}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
                style={{ filter: "grayscale(0.5) contrast(1.1) opacity(0.8)" }}
                className="border-0"
              />
              <div className="absolute right-4 bottom-4 left-4 flex flex-col justify-between gap-4 rounded-lg border border-border bg-card/90 p-4 shadow-lg backdrop-blur-sm sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <h3 className="font-bold text-foreground">Location</h3>
                  <p className="text-sm text-muted-foreground">
                    {personalInfo.city}, {personalInfo.province},{" "}
                    {personalInfo.country}
                  </p>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-muted-foreground">
                    Available remotely worldwide
                  </p>
                  <p className="font-medium text-primary">
                    Timezone: UTC+8 (Manila)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold tracking-wider text-muted-foreground uppercase">
                  Direct Contact
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Email</span>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Phone</span>
                    <a
                      href={`tel:${personalInfo.contactNumber}`}
                      className="font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {personalInfo.contactNumber}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold tracking-wider text-muted-foreground uppercase">
                  Follow Me
                </h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: "LinkedIn", href: personalInfo.linkedinLink },
                    { label: "GitHub", href: personalInfo.githubLink },
                    { label: "Twitter", href: personalInfo.xLink },
                    { label: "Portfolio", href: personalInfo.portfolioLink },
                  ].map(
                    (social) =>
                      social.href && (
                        <Link
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {social.label}
                        </Link>
                      ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="flex flex-col space-y-6 lg:w-1/3">
            <SendMessageForm personalInfo={personalInfo} />
            <Button asChild className="cursor-pointer">
              <Link href={"/contact/assistant"}>Talk to JCM Assistant</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
