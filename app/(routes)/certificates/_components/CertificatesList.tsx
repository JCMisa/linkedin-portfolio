import CertificateCard from "./CertificateCard";
import { CertificateCardSkeleton } from "./CertificateCardSkeleton";

const CertificatesList = ({
  currentUser,
  certificates,
}: {
  currentUser: UserType;
  certificates: CertificateType[];
}) => {
  return (
    <div className="flex flex-col gap-3 w-full lg:w-[75%]">
      {certificates.length > 0
        ? certificates.map((cert: CertificateType) => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              currentUser={currentUser}
            />
          ))
        : [1, 2, 3, 4, 5].map((item) => <CertificateCardSkeleton key={item} />)}
    </div>
  );
};

export default CertificatesList;
