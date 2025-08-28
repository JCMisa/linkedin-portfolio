import React from "react";
import ProfileCard from "./ProfileCard";
import ProfileStats from "./ProfileStats";
import ProfileEngagements from "./ProfileEngagements";
import ProfileMotto from "./ProfileMotto";

const ProfileSection = () => {
  return (
    <div className="flex flex-col items-center gap-2 fixed">
      <ProfileCard />
      <ProfileStats />
      <ProfileMotto />
      <ProfileEngagements />
    </div>
  );
};

export default ProfileSection;
