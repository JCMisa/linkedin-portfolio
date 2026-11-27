import LatestProjects from "./LatestProjects";
import ProfileAboutMessage from "./ProfileAboutMessage";
import ProfileAnalytics from "./ProfileAnalytics";
import ProfileBasicInfo from "./ProfileBasicInfo";
import ProfileServices from "./ProfileServices";
import ProfileSkills from "./ProfileSkills";
import ProfileTestimonials from "./ProfileTestimonials";
import { getPersonalInfo } from "../queries";

const ProfileLeftInfo = async ({
  numberOfUsers,
  numberOfPostLikes,
  numberOfPostComments,
  latestProject1,
  latestProject2,
  userRole,
}: {
  numberOfUsers: number;
  numberOfPostLikes: number;
  numberOfPostComments: number;
  latestProject1: ProjectType;
  latestProject2: ProjectType;
  userRole: string;
}) => {
  // Cached (unstable_cache) — shared with the other profile sections
  const personalInfo = await getPersonalInfo();

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 rounded-lg py-5 lg:py-0">
      {personalInfo && (
        <ProfileBasicInfo userRole={userRole} personalInfo={personalInfo} />
      )}
      <ProfileAnalytics
        numberOfUsers={numberOfUsers}
        numberOfPostLikes={numberOfPostLikes}
        numberOfPostComments={numberOfPostComments}
      />
      <ProfileAboutMessage userRole={userRole} />
      <ProfileServices userRole={userRole} />
      <LatestProjects
        latestProject1={latestProject1}
        latestProject2={latestProject2}
        userRole={userRole}
      />
      <ProfileSkills userRole={userRole} />
      <ProfileTestimonials userRole={userRole} />
    </div>
  );
};

export default ProfileLeftInfo;
