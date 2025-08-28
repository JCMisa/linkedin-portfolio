import CertificatesPreview from "./CertificatesPreview";
import EducationPreview from "./EducationPreview";
import LatestWorkExperience from "./LatestWorkExperience";

const ProfessionalActivities = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <LatestWorkExperience />
      <CertificatesPreview />
      <EducationPreview />
    </div>
  );
};

export default ProfessionalActivities;
