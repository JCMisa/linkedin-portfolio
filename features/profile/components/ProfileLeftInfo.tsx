import { Suspense } from "react";
import LatestProjects from "./LatestProjects";
import ProfileAboutMessage from "./ProfileAboutMessage";
import ProfileAnalytics from "./ProfileAnalytics";
import ProfileBasicInfo from "./ProfileBasicInfo";
import ProfileServices from "./ProfileServices";
import ProfileSkills from "./ProfileSkills";
import ProfileTestimonials from "./ProfileTestimonials";
import {
  LatestProjectsSkeleton,
  ProfileAnalyticsSkeleton,
} from "./ProfileSkeletons";
import { getPersonalInfo } from "../queries";
import {
  getCommentCount,
  getLatestProjects,
  getLikeCount,
} from "@/features/projects/queries";
import { getUserCount } from "@/features/users/queries";

/**
 * Personal info is cached, so most sections prerender into the static shell.
 * The live counts and latest projects are uncached reads and stream in.
 */
const ProfileLeftInfo = async () => {
  const personalInfo = await getPersonalInfo();

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 rounded-lg py-5 lg:py-0">
      {personalInfo && <ProfileBasicInfo personalInfo={personalInfo} />}
      <Suspense fallback={<ProfileAnalyticsSkeleton />}>
        <LiveAnalytics />
      </Suspense>
      <ProfileAboutMessage />
      <ProfileServices />
      <Suspense
        fallback={<LatestProjectsSkeleton className="hidden sm:block" />}
      >
        <LiveLatestProjects />
      </Suspense>
      <ProfileSkills />
      <ProfileTestimonials />
    </div>
  );
};

async function LiveAnalytics() {
  const [numberOfUsers, numberOfPostLikes, numberOfPostComments] =
    await Promise.all([getUserCount(), getLikeCount(), getCommentCount()]);
  return (
    <ProfileAnalytics
      numberOfUsers={numberOfUsers}
      numberOfPostLikes={numberOfPostLikes}
      numberOfPostComments={numberOfPostComments}
    />
  );
}

async function LiveLatestProjects() {
  const [latestProject1, latestProject2] = await getLatestProjects(2);
  return (
    <LatestProjects
      latestProject1={latestProject1 as ProjectType}
      latestProject2={latestProject2 as ProjectType}
    />
  );
}

export default ProfileLeftInfo;
