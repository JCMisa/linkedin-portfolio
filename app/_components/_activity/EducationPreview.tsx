import Image from "next/image";

const EducationPreview = () => {
  return (
    <div className="h-[250px] w-full bg-neutral-100 dark:bg-dark flex flex-col items-start gap-4 rounded-lg overflow-hidden no-scrollbar">
      {/* cover photo */}
      <div className="h-[30%] w-full">
        <Image
          src={"/lspu.webp"}
          alt="school-img"
          width={1000}
          height={1000}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>

      {/* school info */}
      <div className="h-[70%] w-full p-[10px] relative flex flex-col items-center justify-center">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-[5px]">
          <Image
            src={"/ccs-logo.webp"}
            alt="cover-img"
            width={1000}
            height={1000}
            className="w-[72px] h-[72px] object-fill rounded-full border-2 border-white"
          />
          <Image
            src={"/lspu-logo.png"}
            alt="cover-img"
            width={1000}
            height={1000}
            className="w-[72px] h-[72px] object-fill rounded-full border-2 border-white"
          />
        </div>
        <div className="px-2 flex flex-col gap-[2px] mt-3">
          <h1 className="text-md font-bold tracking-wider truncate text-center">
            Laguna State Polytechnic Univesity
          </h1>
          <p className="text-xs text-center truncate">
            Bachelor of Science in Information Technology
          </p>
          <p className="text-xs text-center text-muted-foreground italic truncate">
            Major in Web and Mobile Application Development
          </p>
          <span className="text-[9px] text-center text-muted-foreground mt-2 truncate">
            June 2025 - June 2026
          </span>
        </div>
      </div>
    </div>
  );
};

export default EducationPreview;
