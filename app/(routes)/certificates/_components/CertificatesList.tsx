import CertificateCard from "./CertificateCard";

const CertificatesList = ({
  currentUser,
  certificates,
}: {
  currentUser: UserType;
  certificates: CertificateType[];
}) => {
  return (
    <div className="flex flex-col gap-3 w-full lg:w-[75%]">
      {certificates.length > 0 ? (
        certificates.map((cert: CertificateType) => (
          <CertificateCard
            key={cert.id}
            cert={cert}
            currentUser={currentUser}
          />
        ))
      ) : (
        <p className="text-center text-sm text-gray-500 font-semibold">
          No certificates added yet
        </p>
      )}
    </div>
  );
};

export default CertificatesList;
