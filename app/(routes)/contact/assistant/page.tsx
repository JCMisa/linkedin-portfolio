import type { Metadata } from "next";
import { Suspense } from "react";
import VoiceAgent from "@/features/contact/components/VoiceAgent";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

import { getSessionUser } from "@/lib/auth";
export const metadata: Metadata = {
  title: "AI Assistant",
  robots: { index: false, follow: false },
};

const ContactAssistant = () => {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center bg-muted pt-16"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            How can I help?
          </h1>
          <p className="text-muted-foreground">
            Speak naturally. I&apos;ll take notes and notify John Carlo.
          </p>
        </div>

        {/* The call stage needs the signed-in user, so it streams in */}
        <Suspense
          fallback={
            <Skeleton className="h-[80vh] max-h-[800px] min-h-[500px] w-full rounded-3xl" />
          }
        >
          <AssistantStage />
        </Suspense>
      </div>
    </main>
  );
};

async function AssistantStage() {
  // proxy.ts already guards this route; this is the page's own check
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");

  return <VoiceAgent userName={user.name} credits={user.remainingContactReq} />;
}

export default ContactAssistant;
