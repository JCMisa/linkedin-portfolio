import { getCurrentUser } from "@/lib/actions/users";
import Agent from "./_components/Agent";
import { redirect } from "next/navigation";

const ContactAssistant = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen pt-16 bg-neutral-200/50 dark:bg-black/90 flex flex-col items-center">
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            Let Me Help You With Your Concern
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Speak naturally. I'll take notes and notify the John Carlo.
          </p>
        </div>

        <Agent
          userName={user.name}
          userId={user.userId}
          credits={user.remainingContactReq}
        />
      </div>
    </main>
  );
};

export default ContactAssistant;
