import { LinkPreview } from "@/components/ui/link-preview";
import { PersonalInfoType } from "@/db/schema";

const ProfileStats = ({ personalInfo }: { personalInfo: PersonalInfoType }) => {
  return (
    <div className="flex h-[76px] w-full flex-col items-center justify-center rounded-lg bg-card p-5">
      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold">Resume Link</p>
          <LinkPreview
            url={
              personalInfo.itResumeLink ||
              "https://drive.google.com/file/d/1xYahrMC5zf9qmsRX7_zzENlS31eMue29/view?usp=drive_link"
            }
            className="text-xs font-semibold text-primary"
          >
            Resume
          </LinkPreview>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs font-bold">Github Link</p>
          <LinkPreview
            url={personalInfo.githubLink || "https://github.com/JCMisa"}
            className="text-xs font-semibold text-primary"
          >
            JCMisa
          </LinkPreview>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
