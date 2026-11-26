import {
  BriefcaseBusinessIcon,
  GalleryVerticalEndIcon,
  LaptopIcon,
  PhoneIcon,
} from "lucide-react";
import Link from "next/link";

const ProfileEngagements = () => {
  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-lg bg-card p-5">
      <Link
        href={"/certificates"}
        className="flex items-center gap-2 transition-opacity duration-200 ease-in-out hover:opacity-[0.8]"
      >
        <GalleryVerticalEndIcon className="size-4" />
        <p className="text-xs font-bold">Certifications</p>
      </Link>

      <Link
        href={"/projects"}
        className="flex items-center gap-2 transition-opacity duration-200 ease-in-out hover:opacity-[0.8]"
      >
        <LaptopIcon className="size-4" />
        <p className="text-xs font-bold">Personal Projects</p>
      </Link>

      <Link
        href={"/experiences"}
        className="flex items-center gap-2 transition-opacity duration-200 ease-in-out hover:opacity-[0.8]"
      >
        <BriefcaseBusinessIcon className="size-4" />
        <p className="text-xs font-bold">Work Experiences</p>
      </Link>

      <Link
        href={"/contact"}
        className="flex items-center gap-2 transition-opacity duration-200 ease-in-out hover:opacity-[0.8]"
      >
        <PhoneIcon className="size-4" />
        <p className="text-xs font-bold">Contact Information</p>
      </Link>
    </div>
  );
};

export default ProfileEngagements;
