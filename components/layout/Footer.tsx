import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";

// Real destinations only (the old LinkedIn-style labels went nowhere)
const footerLinks = [
  { label: "About Me", href: "/profile" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experiences" },
  { label: "Certificates", href: "/certificates" },
  { label: "Skills", href: "/profile#skills" },
  { label: "Contact", href: "/contact" },
];

// Cached: the copyright year is the only value that changes, so the footer
// stays in every static shell and refreshes daily.
const Footer = async () => {
  "use cache";
  cacheLife("days");

  return (
    <footer className="flex flex-col items-center justify-center gap-3">
      <nav aria-label="Footer">
        <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {footerLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-sm transition-colors hover:text-primary hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="flex items-center gap-1 text-xs font-bold">
        <Image
          src="/logo.png"
          alt=""
          width={16}
          height={16}
          className="size-4 rounded-xs"
        />
        JCM Portfolio © {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
