import { Metadata } from "next";
import SendMessageForm from "./_components/SendMessageForm";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Contact";

  const description =
    "Get in touch with John Carlo Misa – based in San Pablo City, Philippines. " +
    "Book a call, email jcmisa.dev@gmail.com, or DM on LinkedIn/Twitter. " +
    "Freelance web/mobile development, AI integrations, virtual assistance, and more.";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://jcm-portfolio.vercel.app";

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

const ContactPage = () => {
  return (
    <section className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 body-font relative mt-13">
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900">
        <iframe
          title="map"
          width="100%"
          height="100%"
          src="https://maps.google.com/maps?q=Laguna,Philippines&t=&z=9&ie=UTF8&iwloc=&output=embed"
          style={{ filter: "grayscale(1) contrast(1.2) opacity(0.16)" }}
        />
      </div>

      {/* form */}
      <SendMessageForm />
    </section>
  );
};

export default ContactPage;
