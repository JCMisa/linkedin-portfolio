import { Metadata } from "next";
import ProfileSection from "./_components/_profile/ProfileSection";
import ProfessionalActivities from "./_components/_activity/ProfessionalActivities";

export const metadata: Metadata = {
  title: "Feed | JCM",
  description: "Feed page of my portfolio where my projects posts can be seen.",
};

export default function Home() {
  return (
    <main className="relative py-2 sm:py-10 md:py-12 lg:py-18 sm:px-6 md:px-10 lg:px-16">
      {/* profile - fixed */}
      <div className="hidden lg:block fixed w-[240px] rounded-lg ">
        <ProfileSection />
      </div>

      {/* main content wrapper with offset for profile */}
      <div className="flex flex-col lg:flex-row gap-6 lg:ml-[265px] py-5 lg:py-0">
        {/* posts / projects  */}
        <div className="w-full lg:w-[65%] min-h-[80rem] bg-purple-500 rounded-lg"></div>

        {/* activities */}
        <div className="w-full lg:w-[35%] rounded-lg">
          <ProfessionalActivities />
        </div>
      </div>
    </main>
  );
}
