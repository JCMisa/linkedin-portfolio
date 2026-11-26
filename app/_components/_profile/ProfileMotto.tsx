import Image from "next/image";
import { LinkPreview } from "@/components/ui/link-preview";

const ProfileMotto = () => {
  return (
    <div className="flex h-[65px] w-full flex-col items-start gap-1 rounded-lg bg-neutral-100 py-2 dark:bg-dark">
      <p className="px-5 text-xs font-bold text-muted-foreground">
        My Personal Manifesto
      </p>
      <div className="ml-6 flex items-center gap-1">
        <Image
          src={"/jcm-logo.svg"}
          alt="brand-logo"
          width={1000}
          height={1000}
          className="h-4 w-4"
        />
        <div className="flex flex-col items-start">
          <LinkPreview
            url={"https://jcm-mocha.vercel.app"}
            className="text-[10px] font-bold"
          >
            JCM Mocha Portfolio
          </LinkPreview>
          <p className="line-clamp-1 truncate text-[9px] font-semibold italic">
            &quot;Build with passion, manage with precision.&quot;
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileMotto;
