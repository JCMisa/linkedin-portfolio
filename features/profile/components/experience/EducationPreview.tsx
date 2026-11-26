import Image from "next/image";

const EducationPreview = () => {
  return (
    <div className="no-scrollbar flex h-[250px] w-full flex-col items-start gap-4 overflow-hidden rounded-lg bg-card">
      {/* cover photo */}
      <div className="h-[30%] w-full">
        <Image
          src={"/lspu.webp"}
          alt=""
          width={1000}
          height={1000}
          className="h-full w-full rounded-t-lg object-cover"
        />
      </div>

      {/* school info */}
      <div className="relative flex h-[70%] w-full flex-col items-center justify-center p-[10px]">
        <div className="absolute -top-8 left-1/2 flex -translate-x-1/2 gap-[5px]">
          <Image
            src={"/ccs-logo.webp"}
            alt="College of Computer Studies logo"
            width={1000}
            height={1000}
            className="h-[72px] w-[72px] rounded-full border-2 border-card object-fill"
          />
          <Image
            src={"/lspu-logo.png"}
            alt="Laguna State Polytechnic University logo"
            width={1000}
            height={1000}
            className="h-[72px] w-[72px] rounded-full border-2 border-card object-fill"
          />
        </div>
        <div className="mt-3 flex flex-col gap-[2px] px-2">
          <h2 className="truncate text-center text-base font-semibold">
            Laguna State Polytechnic University
          </h2>
          <p className="truncate text-center text-xs">
            Bachelor of Science in Information Technology
          </p>
          <p className="truncate text-center text-xs text-muted-foreground italic">
            Major in Web and Mobile Application Development
          </p>
          <span className="mt-2 truncate text-center text-[9px] text-muted-foreground">
            June 2025 - June 2026
          </span>
        </div>
      </div>
    </div>
  );
};

export default EducationPreview;
