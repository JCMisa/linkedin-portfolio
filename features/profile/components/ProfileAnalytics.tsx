import {
  EyeIcon,
  MessageSquareMoreIcon,
  ThumbsUpIcon,
  UsersIcon,
} from "lucide-react";

const ProfileAnalytics = ({
  numberOfUsers,
  numberOfPostLikes,
  numberOfPostComments,
}: {
  numberOfUsers: number;
  numberOfPostLikes: number;
  numberOfPostComments: number;
}) => {
  return (
    <div className="flex w-full flex-col rounded-lg bg-card p-5">
      <h2 className="text-2xl font-medium">Engagements</h2>
      <div className="flex items-center gap-1 text-muted-foreground">
        <EyeIcon className="size-4" />
        <p className="text-sm">
          See my portfolio profile and post engagements.
        </p>
      </div>

      <div className="mt-5 flex w-full flex-col items-start gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-2">
          <UsersIcon className="size-5" />
          <div className="flex flex-col items-start gap-[2px]">
            <p className="text-sm font-bold">
              {numberOfUsers || 0} Profile Signin
            </p>
            <span className="text-xs">
              Discover how many people signed in on my profile.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <ThumbsUpIcon className="size-5" />
          <div className="flex flex-col items-start gap-[2px]">
            <p className="text-sm font-bold">
              {numberOfPostLikes || 0} Project likes
            </p>
            <span className="text-xs">
              Checkout who&apos;s engaging with my projects.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MessageSquareMoreIcon className="size-5" />
          <div className="flex flex-col items-start gap-[2px]">
            <p className="text-sm font-bold">
              {numberOfPostComments || 0} Project comments
            </p>
            <span className="text-xs">
              See how often my projects get comments.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAnalytics;
