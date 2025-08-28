import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
        <span className="cursor-pointer hover:underline hover:text-blue-400 transition-all duration-200 ease-in-out">
          About Me
        </span>
        <span className="cursor-pointer hover:underline hover:text-blue-400 transition-all duration-200 ease-in-out">
          Accessibility
        </span>
        <span className="cursor-pointer hover:underline hover:text-blue-400 transition-all duration-200 ease-in-out">
          Need Help?
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
        <span className="cursor-pointer hover:underline hover:text-blue-400 transition-all duration-200 ease-in-out">
          Privacy & Terms
        </span>
        <span className="cursor-pointer hover:underline hover:text-blue-400 transition-all duration-200 ease-in-out">
          Cookie Choices
        </span>
        <span className="cursor-pointer hover:underline hover:text-blue-400 transition-all duration-200 ease-in-out">
          Collaborate
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
        <span className="cursor-pointer hover:underline hover:text-blue-400 transition-all duration-200 ease-in-out">
          Download Resume
        </span>
        <span className="cursor-pointer hover:underline hover:text-blue-400 transition-all duration-200 ease-in-out">
          Get My Details
        </span>
        <span className="cursor-pointer hover:underline hover:text-blue-400 transition-all duration-200 ease-in-out">
          More
        </span>
      </div>

      <Link href={"/"} className="flex items-center text-xs font-bold gap-1">
        <Image
          src="/logo.png"
          alt="logo"
          width={1000}
          height={1000}
          className="w-4 h-4 rounded-xs"
        />
        JCM Portfolio © {new Date().getFullYear()}
      </Link>
    </div>
  );
};

export default Footer;
