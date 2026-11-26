import { getCurrentUser } from "@/lib/actions/users";
import Agent from "./_components/Agent";
import { redirect } from "next/navigation";

const ContactAssistant = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-neutral-200/50 pt-16 dark:bg-black/90">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            Let Me Help You With Your Concern
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Speak naturally. I&apos;ll take notes and notify John Carlo.
          </p>
        </div>

        <Agent userName={user.name} credits={user.remainingContactReq} />
      </div>
    </main>
  );
};

export default ContactAssistant;
