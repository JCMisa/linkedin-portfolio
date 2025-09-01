import {
  BriefcaseBusinessIcon,
  GalleryVerticalEndIcon,
  LaptopIcon,
  PhoneIcon,
} from "lucide-react";
import Link from "next/link";

const ProfileEngagements = () => {
  return (
    <div className=" w-full dark:bg-dark flex flex-col items-start gap-4 rounded-lg p-5">
      <Link
        href={"/certificates"}
        className="flex items-center gap-2 hover:opacity-[0.8] transition-opacity duration-200 ease-in-out"
      >
        <GalleryVerticalEndIcon className="size-4" />
        <p className="text-xs font-bold">Certifications</p>
      </Link>

      <Link
        href={"/projects"}
        className="flex items-center gap-2 hover:opacity-[0.8] transition-opacity duration-200 ease-in-out"
      >
        <LaptopIcon className="size-4" />
        <p className="text-xs font-bold">Personal Projects</p>
      </Link>

      <Link
        href={"/experiences"}
        className="flex items-center gap-2 hover:opacity-[0.8] transition-opacity duration-200 ease-in-out"
      >
        <BriefcaseBusinessIcon className="size-4" />
        <p className="text-xs font-bold">Work Experiences</p>
      </Link>

      <Link
        href={"/contact"}
        className="flex items-center gap-2 hover:opacity-[0.8] transition-opacity duration-200 ease-in-out"
      >
        <PhoneIcon className="size-4" />
        <p className="text-xs font-bold">Contact Information</p>
      </Link>
    </div>
  );
};

export default ProfileEngagements;
