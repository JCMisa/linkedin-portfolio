import EducationPreview from "./EducationPreview";
import LatestWorkExperience from "./LatestWorkExperience";

const ProfessionalActivities = () => {
  return (
    <div className="w-full flex flex-col gap-2">
      {/* Normal scrolling content */}
      <div className="space-y-2">
        <LatestWorkExperience />
        <EducationPreview />
      </div>
    </div>
  );
};

export default ProfessionalActivities;
