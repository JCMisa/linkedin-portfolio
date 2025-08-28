import Footer from "@/components/custom/Footer";
import CertificatesPreview from "./CertificatesPreview";
import EducationPreview from "./EducationPreview";
import LatestWorkExperience from "./LatestWorkExperience";

const ProfessionalActivities = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <LatestWorkExperience />
      <CertificatesPreview />
      <EducationPreview />

      <div className="mt-5">
        <Footer />
      </div>
    </div>
  );
};

export default ProfessionalActivities;
