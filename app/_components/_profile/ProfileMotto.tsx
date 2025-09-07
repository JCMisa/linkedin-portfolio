import Image from "next/image";

const ProfileMotto = () => {
  return (
    <div className="h-[60px] w-full bg-neutral-100 dark:bg-dark flex flex-col items-start gap-1 rounded-lg py-2">
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
        <p className="text-[9px] font-bold italic line-clamp-1 truncate">
          {"Build with passion, manage with precision."}
        </p>
      </div>
    </div>
  );
};

export default ProfileMotto;
