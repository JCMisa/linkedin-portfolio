import React from "react";
import ProfileCard from "./ProfileCard";
import ProfileStats from "./ProfileStats";

const ProfileSection = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <ProfileCard />
      <ProfileStats />
    </div>
  );
};

export default ProfileSection;
