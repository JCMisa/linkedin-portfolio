import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import SendMessageForm from "@/features/contact/components/SendMessageForm";
import { getPersonalInfo } from "@/features/profile/queries";
import { PersonalInfoType } from "@/db/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Hire John Carlo Misa for web, mobile and AI development or virtual assistance. Send a message or talk to the AI voice assistant. Based in the Philippines.",
  path: "/contact",
  keywords: [
    "hire full-stack developer",
    "freelance developer Philippines",
    "Next.js freelancer",
    "AI integration services",
    "virtual assistant",
  ],
});

const ContactPage = async () => {
  const personalInfo: PersonalInfoType | null = await getPersonalInfo();

  if (!personalInfo) {
    return null;
  }

  return (
    <main id="main-content" className="min-h-screen bg-muted pt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="sr-only">Contact John Carlo Misa</h1>
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Side: Map & Contact Info */}
          <div className="space-y-6 lg:w-2/3">
            <div className="relative h-[400px] overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:h-[500px]">
              <iframe
                title={`Map of ${personalInfo.city}, ${personalInfo.country}`}
                loading="lazy"
                width="100%"
                height="100%"
                src={`https://maps.google.com/maps?q=${personalInfo.city},${personalInfo.country}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
                style={{ filter: "grayscale(0.5) contrast(1.1) opacity(0.8)" }}
                className="border-0"
              />
              <div className="absolute right-4 bottom-4 left-4 flex flex-col justify-between gap-4 rounded-lg border border-border bg-card/90 p-4 shadow-lg backdrop-blur-sm sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <h2 className="font-bold text-foreground">Location</h2>
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
                <h2 className="mb-4 text-sm font-bold tracking-wider text-muted-foreground uppercase">
                  Direct contact
                </h2>
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
                <h2 className="mb-4 text-sm font-bold tracking-wider text-muted-foreground uppercase">
                  Follow me
                </h2>
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
