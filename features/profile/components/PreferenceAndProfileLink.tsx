"use client";

import { LinkPreview } from "@/components/ui/link-preview";
import { Separator } from "@/components/ui/separator";
import { AccentPicker } from "@/components/shared/AccentPicker";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const PUBLIC_URL = "https://jcm-portfolio.vercel.app/profile";

/** LinkedIn-style right-rail card: display preferences + public profile URL. */
const PreferenceAndProfileLink = () => {
  const [justCopied, setJustCopied] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(PUBLIC_URL);
      setJustCopied(true);
      toast.success("URL copied");
      setTimeout(() => setJustCopied(false), 4000);
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Couldn't copy the URL.");
    }
  };

  return (
    <div className="flex flex-col rounded-lg border bg-card">
      <Image
        src="/profile-banner.gif"
        alt=""
        unoptimized
        width={1000}
        height={1000}
        className="image-pixelated rounded-t-lg object-cover"
        style={{
          maxWidth: "100%",
          height: "100px",
        }}
      />

      <div className="flex w-full flex-col items-start gap-2 p-3">
        <h2 className="text-base font-semibold">Theme color</h2>
        <AccentPicker />
      </div>

      <Separator />

      <div className="flex w-full flex-col items-start gap-2 p-3">
        <h2 className="text-base font-semibold">Public profile & URL</h2>
        <div className="flex w-full items-center justify-between gap-2">
          <LinkPreview
            url={PUBLIC_URL}
            className="min-w-0 truncate text-xs text-muted-foreground hover:underline"
          >
            {PUBLIC_URL}
          </LinkPreview>

          <button
            type="button"
            onClick={copyUrl}
            aria-label={justCopied ? "URL copied" : "Copy profile URL"}
            className="shrink-0 cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {justCopied ? (
              <CopyCheckIcon className="size-4 text-success" />
            ) : (
              <CopyIcon className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferenceAndProfileLink;
