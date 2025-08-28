import { Metadata } from "next";
import ProfileSection from "./_components/ProfileSection";

export const metadata: Metadata = {
  title: "Feed | JCM",
  description: "Feed page of my portfolio where my projects posts can be seen.",
};

export default function Home() {
  return (
    <main className="py-2 sm:py-10 md:py-12 lg:py-18 sm:px-6 md:px-10 lg:px-16 flex flex-col lg:flex-row gap-6">
      {/* profile */}
      <div className="w-[20%] rounded-lg">
        <ProfileSection />
      </div>

      {/* posts / projects  */}
      <div className="w-[50%] min-h-[40rem] bg-purple-500 rounded-lg ml-5"></div>

      {/* activities */}
      <div className="w-[30%]  bg-purple-500 rounded-lg"></div>
    </main>
  );
}
