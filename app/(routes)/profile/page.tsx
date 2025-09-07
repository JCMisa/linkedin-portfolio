import CertificatesPreview from "@/app/_components/_activity/CertificatesPreview";
import Footer from "@/components/custom/Footer";
import ProfileLeftInfo from "./_components/ProfileLeftInfo";
import { getAllUsers, getCurrentUser } from "@/lib/actions/users";
import { getAllLikes } from "@/lib/actions/likes";
import { getAllComments } from "@/lib/actions/comments";
import { Metadata } from "next";
import { getAllProjects } from "@/lib/actions/projects";
import PreferenceAndProfileLink from "./_components/PreferenceAndProfileLink";
import DownloadResumeMobile from "./_components/DownloadResumeMobile";

export const metadata: Metadata = {
  title: "Profile | JCM",
  description:
    "Profile page of my portfolio where my you can see the overview of John Carlo Misa.",
};

const ProfilePage = async () => {
  const [
    currentUser,
    allUsers,
    numberOfPostLikes,
    numberOfPostComments,
    projects,
  ] = await Promise.all([
    getCurrentUser(),
    getAllUsers(),
    getAllLikes(),
    getAllComments(),
    getAllProjects(),
  ]);

  let latestProject1;
  let latestProject2;

  if (projects && projects.success && projects.data) {
    latestProject1 = projects.data[0];
    latestProject2 = projects.data[1];
  }

  return (
    <main className="relative py-14 lg:py-18 px-6 md:px-10 lg:px-16 ">
      <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row gap-6">
        {/* left info */}
        <ProfileLeftInfo
          numberOfUsers={allUsers.length || 0}
          numberOfPostLikes={numberOfPostLikes.data?.length || 0}
          numberOfPostComments={numberOfPostComments.data?.length || 0}
          latestProject1={latestProject1 as ProjectType}
          latestProject2={latestProject2 as ProjectType}
          userRole={currentUser ? currentUser.role : "user"}
        />

        {/* right info */}
        <div className="w-full lg:w-[320px] rounded-lg flex flex-col gap-2">
          <PreferenceAndProfileLink />

          <div className="sticky top-[73px]">
            <CertificatesPreview />
            <div className="mt-4">
              <Footer />
            </div>
          </div>
        </div>
      </div>

      <DownloadResumeMobile />
    </main>
  );
};

export default ProfilePage;
