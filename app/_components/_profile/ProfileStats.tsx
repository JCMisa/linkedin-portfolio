import React from "react";

const ProfileStats = () => {
  return (
    <div className="h-[76px] w-full dark:bg-dark flex flex-col items-center justify-center rounded-lg p-5">
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold">Profile viewers</p>
          <span className="text-xs font-semibold text-blue-500">71</span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs font-bold">Project impressions</p>
          <span className="text-xs font-semibold text-blue-500">103</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
