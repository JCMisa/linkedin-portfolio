import { MapPin, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PersonalInfoType } from "@/config/schema";

const ProfileCard = ({ personalInfo }: { personalInfo: PersonalInfoType }) => {
  const currentExperience = personalInfo.experiences.find(
    (e) => !e.dateTo || e.dateTo === "",
  );

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      {/* Cover photo */}
      {personalInfo.coverImg ? (
        <div className="relative h-16 w-full sm:h-20">
          <Image
            src={personalInfo.coverImg || "/empty-img.webp"}
            alt="cover-img"
            width={1000}
            height={1000}
            className="h-full w-full rounded-t-lg object-cover"
          />
        </div>
      ) : (
        <div className="relative h-16 bg-gradient-to-r from-primary/80 to-primary sm:h-20" />
      )}

      {/* Avatar */}
      <div className="relative z-10 -mt-8 px-4">
        {personalInfo.profileImg ? (
          <Image
            src={personalInfo.profileImg || "/empty-img.webp"}
            alt="cover-img"
            width={1000}
            height={1000}
            className="h-16 w-16 rounded-full border-4 border-card bg-accent object-fill dark:border-dark"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-card bg-accent text-2xl font-bold text-primary">
            JC
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 pt-2">
        <Link
          href={"/profile"}
          className="text-base font-semibold text-foreground transition-all duration-200 ease-linear hover:underline hover:opacity-[0.8]"
        >
          {personalInfo.name}
        </Link>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {personalInfo.industryRole}
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {personalInfo.city}, {personalInfo.province}
        </p>

        {/* Current role */}
        {currentExperience && (
          <div className="mt-3 border-t border-border pt-3">
            <p className="text-xs text-muted-foreground">Current</p>
            <div className="flex items-center gap-2">
              <Image
                src={currentExperience.bannerImg || "/empty-img.webp"}
                alt={currentExperience.title}
                width={1000}
                height={1000}
                className="size-4 rounded-sm object-cover sm:size-5 md:size-6 lg:size-7"
              />
              <p className="mt-0.5 text-sm font-medium text-foreground">
                {currentExperience.title}
              </p>
            </div>
          </div>
        )}

        <Link
          href="/profile"
          className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View full profile <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
