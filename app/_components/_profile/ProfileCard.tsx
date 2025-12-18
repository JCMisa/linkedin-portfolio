import Image from "next/image";
import Link from "next/link";
import { PersonalInfoType } from "@/config/schema";

const ProfileCard = ({ personalInfo }: { personalInfo: PersonalInfoType }) => {
  return (
    <div className="h-[210px] w-full bg-neutral-100 dark:bg-dark flex flex-col items-center rounded-lg">
      {/* cover photo */}
      <div className="h-[30%] w-full">
        <Image
          src={personalInfo.coverImg || "/empty-img.webp"}
          alt="cover-img"
          width={1000}
          height={1000}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>

      {/* profile info */}
      <div className="h-[70%] w-full p-[10px] relative">
        <Image
          src={personalInfo.profileImg || "/empty-img.webp"}
          alt="cover-img"
          width={1000}
          height={1000}
          className="w-[72px] h-[72px] object-fill rounded-full border-2 border-white dark:border-dark absolute -top-8 left-4"
        />
        <div className="mt-8 px-2 flex flex-col gap-[2px]">
          <Link
            href={"/profile"}
            className="text-lg font-bold tracking-wider hover:underline hover:opacity-[0.8] transition-all ease-linear duration-200"
          >
            {personalInfo.name}
          </Link>
          <span className="text-xs font-semibold">
            {personalInfo.industryRole}
          </span>
          <span className="text-xs font-semibold text-muted-foreground">
            {personalInfo.city}, {personalInfo.province}
          </span>
          <div className="flex items-center gap-1 mt-1">
            <Image
              src={personalInfo.experiences[0].bannerImg || "/empty-img.webp"}
              alt={personalInfo.experiences[0].title}
              width={1000}
              height={1000}
              className="w-4 h-4 rounded-sm object-cover"
            />
            <p className="text-[9px] font-bold capitalize">
              {personalInfo.experiences[0].title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
