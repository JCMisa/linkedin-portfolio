import VoiceAgent from "@/features/contact/components/VoiceAgent";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";
const ContactAssistant = async () => {
  const user = await getSessionUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-muted pt-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-bold text-foreground">
            Let Me Help You With Your Concern
          </h3>
          <p className="text-muted-foreground">
            Speak naturally. I&apos;ll take notes and notify John Carlo.
          </p>
        </div>

        <VoiceAgent userName={user.name} credits={user.remainingContactReq} />
      </div>
    </main>
  );
};

export default ContactAssistant;
