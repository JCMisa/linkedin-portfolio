import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import AIChatbot from "@/features/chatbot/components/AIChatbot";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { shadcn } from "@clerk/ui/themes";
import { siteConfig } from "@/lib/seo";
import { ACCENT_INIT_SCRIPT } from "@/lib/accent";

// Icons come from app/favicon.ico, app/icon.svg and app/apple-icon.png;
// social previews from app/opengraph-image.tsx and app/twitter-image.tsx;
// the manifest from app/manifest.ts (all wired by Next's file conventions).
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  openGraph: {
    type: "website",
    url: "/",
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitter,
    creator: siteConfig.twitter,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: { title: siteConfig.shortName, statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteConfig.colors.light },
    { media: "(prefers-color-scheme: dark)", color: siteConfig.colors.dark },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        theme: shadcn,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Saved theme color, applied before paint (no flash of the default) */}
          <script dangerouslySetInnerHTML={{ __html: ACCENT_INIT_SCRIPT }} />
        </head>
        <body>
          <a
            href="#main-content"
            className="sr-only z-[100] rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
          >
            Skip to main content
          </a>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <TooltipProvider>
                <Navbar />
                {children}
                <div className="fixed right-3 bottom-3">
                  <AIChatbot />
                </div>
              </TooltipProvider>
            </QueryProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
