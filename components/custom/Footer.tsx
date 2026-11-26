import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="cursor-pointer transition-all duration-200 ease-in-out hover:text-blue-400 hover:underline">
          About Me
        </span>
        <span className="cursor-pointer transition-all duration-200 ease-in-out hover:text-blue-400 hover:underline">
          Accessibility
        </span>
        <span className="cursor-pointer transition-all duration-200 ease-in-out hover:text-blue-400 hover:underline">
          Need Help?
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="cursor-pointer transition-all duration-200 ease-in-out hover:text-blue-400 hover:underline">
          Privacy & Terms
        </span>
        <span className="cursor-pointer transition-all duration-200 ease-in-out hover:text-blue-400 hover:underline">
          Cookie Choices
        </span>
        <span className="cursor-pointer transition-all duration-200 ease-in-out hover:text-blue-400 hover:underline">
          Collaborate
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="cursor-pointer transition-all duration-200 ease-in-out hover:text-blue-400 hover:underline">
          Download Resume
        </span>
        <span className="cursor-pointer transition-all duration-200 ease-in-out hover:text-blue-400 hover:underline">
          Get My Details
        </span>
        <span className="cursor-pointer transition-all duration-200 ease-in-out hover:text-blue-400 hover:underline">
          More
        </span>
      </div>

      <Link href={"/"} className="flex items-center gap-1 text-xs font-bold">
        <Image
          src="/logo.png"
          alt="logo"
          width={1000}
          height={1000}
          className="h-4 w-4 rounded-xs"
        />
        JCM Portfolio © {new Date().getFullYear()}
      </Link>
    </div>
  );
};

export default Footer;
