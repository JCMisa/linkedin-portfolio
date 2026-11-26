import type { Metadata } from "next";
import { env } from "@/lib/env";

/** Site-wide identity used by metadata, JSON-LD, the manifest and OG images. */
export const siteConfig = {
  name: "John Carlo Misa",
  shortName: "JCM",
  title: "John Carlo Misa | Full-stack Developer",
  description:
    "Portfolio of John Carlo Misa, a full-stack developer from the Philippines building web, mobile and AI apps with Next.js, TypeScript and AWS.",
  jobTitle: "Full-stack Developer",
  url: env.NEXT_PUBLIC_SITE_URL,
  locale: "en_US",
  twitter: "@jcmisa_dev",
  location: {
    locality: "San Pablo City",
    region: "Laguna",
    country: "PH",
  },
  links: {
    linkedin: "https://www.linkedin.com/in/john-carlo-misa-80a1b5208",
    github: "https://github.com/JCMisa",
  },
  /**
   * Browser chrome colors. <meta name="theme-color"> and the web manifest
   * need literal colors (no CSS variables), so these mirror --card and
   * --background in app/globals.css. Keep them in sync.
   */
  colors: {
    light: "#ffffff",
    dark: "#1b1f23",
    background: "#f4f2ee",
    /** Logo color, used by the generated OG image. */
    brand: "#f43f5e",
  },
} as const;

interface PageMetadataInput {
  /** Page title; the root template appends " | John Carlo Misa". */
  title: string;
  /** Aim for 150-160 characters (Google truncates longer snippets). */
  description: string;
  /** Path from the site root, e.g. "/projects". Used for canonical + og:url. */
  path: string;
  keywords?: string[];
  /** Overrides the generated /opengraph-image (e.g. a project screenshot). */
  image?: { url: string; alt: string };
  type?: "website" | "profile" | "article";
}

/**
 * Per-page metadata. Shared defaults (metadataBase, robots, authors, icons,
 * manifest) live in the root layout; this only sets what differs per page.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  image,
  type = "website",
}: PageMetadataInput): Metadata {
  const socialTitle = `${title} | ${siteConfig.name}`;
  // A page-level openGraph/twitter object replaces the parent's, including the
  // file-based images, so the generated defaults are set explicitly here.
  const ogImages = [image ?? defaultImage("/opengraph-image")];
  const twitterImages = [image ?? defaultImage("/twitter-image")];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title: socialTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitter,
      creator: siteConfig.twitter,
      title: socialTitle,
      description,
      images: twitterImages,
    },
  };
}

/** The branded 1200x630 card from app/opengraph-image.tsx / twitter-image.tsx. */
function defaultImage(path: "/opengraph-image" | "/twitter-image") {
  return {
    url: path,
    width: 1200,
    height: 630,
    alt: `${siteConfig.name}, ${siteConfig.jobTitle}`,
    type: "image/png",
  };
}

/** Clamp text for meta descriptions without cutting a word in half. */
export function toMetaDescription(text: string | null | undefined, max = 160) {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

/** schema.org Person, rendered as JSON-LD on the home and profile pages. */
export function personJsonLd(image?: string | null) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: siteConfig.jobTitle,
    image: image || `${siteConfig.url}/icons/icon-512.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.locality,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.country,
    },
    sameAs: [siteConfig.links.linkedin, siteConfig.links.github],
  };
}
