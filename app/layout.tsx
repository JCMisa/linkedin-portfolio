import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/custom/theme-provider";
import Navbar from "@/components/custom/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import AIChatbot from "@/components/custom/AIChatbot";
import { UserStoreWatcher } from "@/providers/UserStoreWatcher";
import { TooltipProvider } from "@/components/ui/tooltip";
import { shadcn } from "@clerk/ui/themes";

const sourceSans3 = Source_Sans_3({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "JCM",
    template: "%s | JCM",
  },
  description: "My portfolio inspired on Linkedin",
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
        variables: { colorPrimary: "#0a66c2" },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${sourceSans3.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <Navbar />
              <UserStoreWatcher />
              {children}
              <div className="fixed bottom-3 right-3">
                <AIChatbot />
              </div>
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
