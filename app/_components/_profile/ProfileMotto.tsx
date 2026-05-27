import Image from "next/image";
import { LinkPreview } from "@/components/ui/link-preview";

const ProfileMotto = () => {
  return (
    <div className="h-[65px] w-full bg-neutral-100 dark:bg-dark flex flex-col items-start gap-1 rounded-lg py-2">
      <p className="text-xs font-bold text-muted-foreground px-5">
        My Personal Manifesto
      </p>
      <div className="ml-6 flex items-center gap-1">
        <Image
          src={"/jcm-logo.svg"}
          alt="brand-logo"
          width={1000}
          height={1000}
          className="w-4 h-4"
        />
        <div className="flex flex-col items-start">
          <LinkPreview
            url={"https://jcm-mocha.vercel.app"}
            className="text-[10px] font-bold "
          >
            JCM Mocha Portfolio
          </LinkPreview>
          <p className="text-[9px] font-semibold italic line-clamp-1 truncate">
            &quot;Build with passion, manage with precision.&quot;
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileMotto;
