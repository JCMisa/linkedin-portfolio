import CertificatesPreview from "@/app/_components/_activity/CertificatesPreview";
import ProfileCard from "@/app/_components/_profile/ProfileCard";
import Footer from "@/components/custom/Footer";
import ProjectsList from "./_components/ProjectsList";
import { getCurrentUser } from "@/lib/actions/users";

const ProjectsPage = async () => {
  const [currentUser] = await Promise.all([getCurrentUser()]);

  return (
    <main className="relative py-18 px-6 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row gap-6">
        {/* projects list */}
        <ProjectsList currentUser={currentUser} />

        {/* profile and latest certificates and footer - fixed */}
        <div className="w-full lg:w-[320px] rounded-lg flex flex-col gap-2">
          <ProfileCard />

          <div className="sticky top-[73px]">
            <CertificatesPreview />
            <div className="mt-4">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProjectsPage;
