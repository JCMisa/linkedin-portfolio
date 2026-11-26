"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import dynamic from "next/dynamic";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "@/lib/utils";

// The animated card (and the `motion` library) load on first hover only
const LinkPreviewCard = dynamic(() => import("./link-preview-card"));

type LinkPreviewProps = {
  children: ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  layout?: string;
} & (
  { isStatic: true; imageSrc: string } | { isStatic?: false; imageSrc?: never }
);

/** Microlink screenshot URL for a live page preview. */
function screenshotUrl(url: string, width: number, height: number) {
  const params = new URLSearchParams({
    url,
    screenshot: "true",
    meta: "false",
    embed: "screenshot.url",
    colorScheme: "dark",
    "viewport.isMobile": "true",
    "viewport.deviceScaleFactor": "1",
    "viewport.width": String(width * 3),
    "viewport.height": String(height * 3),
  });
  return `https://api.microlink.io/?${params}`;
}

/** A link that shows a screenshot of its target in a hover card. */
export const LinkPreview = ({
  children,
  url,
  className,
  width = 200,
  height = 125,
  isStatic = false,
  imageSrc = "",
}: LinkPreviewProps) => {
  const src = isStatic ? imageSrc : screenshotUrl(url, width, height);
  const [isOpen, setOpen] = useState(false);
  const [offsetX, setOffsetX] = useState(0);

  const handleMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    // Half the distance from center keeps the follow effect subtle
    setOffsetX((event.clientX - rect.left - rect.width / 2) / 2);
  };

  // Warm the screenshot as soon as the pointer arrives (not on page load)
  const prefetch = () => {
    new Image().src = src;
  };

  return (
    <HoverCardPrimitive.Root
      openDelay={50}
      closeDelay={100}
      onOpenChange={setOpen}
    >
      <HoverCardPrimitive.Trigger
        onMouseEnter={prefetch}
        onMouseMove={handleMouseMove}
        className={cn("text-foreground", className)}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Content
        className="[transform-origin:var(--radix-hover-card-content-transform-origin)]"
        side="top"
        align="center"
        sideOffset={10}
      >
        <LinkPreviewCard
          open={isOpen}
          url={url}
          src={src}
          width={width}
          height={height}
          offsetX={offsetX}
        />
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Root>
  );
};
