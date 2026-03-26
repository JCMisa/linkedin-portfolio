import { MapPin, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PersonalInfoType } from "@/config/schema";

const ProfileCard = ({ personalInfo }: { personalInfo: PersonalInfoType }) => {
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      {/* Cover photo */}
      {personalInfo.coverImg ? (
        <div className="h-16 sm:h-20 relative w-full">
          <Image
            src={personalInfo.coverImg || "/empty-img.webp"}
            alt="cover-img"
            width={1000}
            height={1000}
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>
      ) : (
        <div className="h-16 sm:h-20 bg-gradient-to-r from-primary/80 to-primary relative" />
      )}

      {/* Avatar */}
      <div className="px-4 -mt-8 relative z-10">
        {personalInfo.profileImg ? (
          <Image
            src={personalInfo.profileImg || "/empty-img.webp"}
            alt="cover-img"
            width={1000}
            height={1000}
            className="w-16 h-16 object-fill rounded-full border-4 border-card dark:border-dark bg-accent"
          />
        ) : (
          <div className="w-16 h-16 rounded-full border-4 border-card bg-accent flex items-center justify-center text-2xl font-bold text-primary">
            JC
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 pt-2">
        <Link
          href={"/profile"}
          className="font-semibold text-foreground text-base hover:underline hover:opacity-[0.8] transition-all ease-linear duration-200"
        >
          {personalInfo.name}
        </Link>
        <p className="text-sm text-muted-foreground mt-0.5">
          {personalInfo.industryRole}
        </p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <MapPin className="w-3 h-3" />
          {personalInfo.city}, {personalInfo.province}
        </p>

        {/* Current role */}
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Current</p>
          <div className="flex items-center gap-2">
            <Image
              src={personalInfo.experiences[1].bannerImg || "/empty-img.webp"}
              alt={personalInfo.experiences[1].title}
              width={1000}
              height={1000}
              className="size-4 sm:size-5 md:size-6 lg:size-7 rounded-sm object-cover"
            />
            <p className="text-sm font-medium text-foreground mt-0.5">
              {personalInfo.experiences[1].title}
            </p>
          </div>
        </div>

        <Link
          href="/profile"
          className="flex items-center gap-1 mt-3 text-xs font-semibold text-primary hover:underline"
        >
          View full profile <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
