import { JsonLd } from "@/components/shared/JsonLd";
import { pageMetadata, personJsonLd } from "@/lib/seo";
import CertificatesPreview from "@/features/certificates/components/CertificatesPreview";
import Footer from "@/components/layout/Footer";
import ProfileLeftInfo from "@/features/profile/components/ProfileLeftInfo";
import type { Metadata } from "next";
import PreferenceAndProfileLink from "@/features/profile/components/PreferenceAndProfileLink";
import DownloadResumeMobile from "@/features/profile/components/DownloadResumeMobile";

import {
  getLatestProjects,
  getLikeCount,
  getCommentCount,
} from "@/features/projects/queries";
import { getUserCount } from "@/features/users/queries";
import { getSessionUser } from "@/lib/auth";
export const metadata: Metadata = pageMetadata({
  title: "Profile",
  description:
    "John Carlo Misa: AWS-certified full-stack developer from Laguna, Philippines, building Next.js, .NET and AI apps. Resume, skills, education and testimonials.",
  path: "/profile",
  type: "profile",
  keywords: [
    "John Carlo Misa",
    "full-stack developer Philippines",
    "Next.js developer",
    "AWS certified developer",
    "React Native developer",
    "freelance web developer",
  ],
});

const ProfilePage = async () => {
  const [
    currentUser,
    numberOfUsers,
    numberOfPostLikes,
    numberOfPostComments,
    projects,
  ] = await Promise.all([
    getSessionUser(),
    getUserCount(),
    getLikeCount(),
    getCommentCount(),
    getLatestProjects(2),
  ]);

  const [latestProject1, latestProject2] = projects;

  return (
    <main className="relative px-6 py-18 md:px-10 lg:px-16">
      <JsonLd data={personJsonLd()} />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 xl:flex-row">
        {/* left info */}
        <ProfileLeftInfo
          numberOfUsers={numberOfUsers}
          numberOfPostLikes={numberOfPostLikes}
          numberOfPostComments={numberOfPostComments}
          latestProject1={latestProject1 as ProjectType}
          latestProject2={latestProject2 as ProjectType}
          userRole={currentUser ? currentUser.role : "user"}
        />

        {/* right info */}
        <div className="flex w-full flex-col gap-2 rounded-lg xl:w-[320px]">
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
