import { LinkPreview } from "@/components/ui/link-preview";
import { PersonalInfoType } from "@/config/schema";

const ProfileStats = ({ personalInfo }: { personalInfo: PersonalInfoType }) => {
  return (
    <div className="h-[76px] w-full bg-neutral-100 dark:bg-dark flex flex-col items-center justify-center rounded-lg p-5">
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold">Resume Link</p>
          <LinkPreview
            url={
              personalInfo.itResumeLink ||
              "https://drive.google.com/file/d/1xYahrMC5zf9qmsRX7_zzENlS31eMue29/view?usp=drive_link"
            }
            className="text-xs font-semibold !text-blue-500"
          >
            Resume
          </LinkPreview>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs font-bold">Github Link</p>
          <LinkPreview
            url={personalInfo.githubLink || "https://github.com/JCMisa"}
            className="text-xs font-semibold !text-blue-500"
          >
            JCMisa
          </LinkPreview>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
