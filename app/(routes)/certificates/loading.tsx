import { CertificateCardSkeleton } from "@/features/certificates/components/CertificateCardSkeleton";
import { PageSkeleton, SidebarSkeleton } from "@/components/shared/skeletons";

/** Sidebar on the left, certificate grid on the right. */
export default function CertificatesLoading() {
  return (
    <PageSkeleton>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        <SidebarSkeleton />
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-[85%]">
          {[1, 2, 3, 4].map((i) => (
            <CertificateCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </PageSkeleton>
  );
}
