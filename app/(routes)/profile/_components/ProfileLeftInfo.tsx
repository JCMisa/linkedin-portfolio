import LatestProjects from "./LatestProjects";
import ProfileAboutMessage from "./ProfileAboutMessage";
import ProfileAnalytics from "./ProfileAnalytics";
import ProfileBasicInfo from "./ProfileBasicInfo";
import ProfileServices from "./ProfileServices";
import ProfileSkills from "./ProfileSkills";
import ProfileTestimonials from "./ProfileTestimonials";

const ProfileLeftInfo = ({
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
  return (
    <div className="flex flex-col gap-2 py-5 lg:py-0 w-full rounded-lg">
      <ProfileBasicInfo />
      <ProfileAnalytics
        numberOfUsers={numberOfUsers}
        numberOfPostLikes={numberOfPostLikes}
        numberOfPostComments={numberOfPostComments}
      />
      <ProfileAboutMessage />
      <ProfileServices />
      <LatestProjects
        latestProject1={latestProject1}
        latestProject2={latestProject2}
        userRole={userRole}
      />
      <ProfileSkills />
      <ProfileTestimonials />
    </div>
  );
};

export default ProfileLeftInfo;
