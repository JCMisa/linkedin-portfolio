import { PersonalInfoType } from "@/config/schema";
import EducationPreview from "./EducationPreview";
import LatestWorkExperience from "./LatestWorkExperience";

const ProfessionalActivities = ({
  personalInfo,
}: {
  personalInfo: PersonalInfoType;
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {/* Normal scrolling content */}
      <div className="space-y-2">
        <LatestWorkExperience personalInfo={personalInfo} />
        <EducationPreview />
      </div>
    </div>
  );
};

export default ProfessionalActivities;
