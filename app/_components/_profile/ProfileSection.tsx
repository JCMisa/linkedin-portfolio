import ProfileCard from "./ProfileCard";
import ProfileStats from "./ProfileStats";
import ProfileEngagements from "./ProfileEngagements";
import ProfileMotto from "./ProfileMotto";
import { PersonalInfoType } from "@/config/schema";

const ProfileSection = ({
  personalInfo,
}: {
  personalInfo: PersonalInfoType;
}) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <ProfileCard personalInfo={personalInfo} />
      <ProfileStats personalInfo={personalInfo} />
      <ProfileMotto />
      <ProfileEngagements />
    </div>
  );
};

export default ProfileSection;
