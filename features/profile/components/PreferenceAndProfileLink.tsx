"use client";

import { LinkPreview } from "@/components/ui/link-preview";
import { Separator } from "@/components/ui/separator";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const PUBLIC_URL = "https://jcm-portfolio.vercel.app/profile";

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

      <Separator />

      <div className="flex w-full flex-col items-start gap-2 p-3">
        <p className="text-lg font-bold">Public profile & URL</p>
        <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <LinkPreview
            url="https://jcm-portfolio.vercel.app/profile"
            className="text-xs text-muted-foreground hover:underline"
          >
            https://jcm-portfolio.vercel.app/profile
          </LinkPreview>

          {justCopied ? (
            <CopyCheckIcon className="size-4 text-success" />
          ) : (
            <CopyIcon
              onClick={copyUrl}
              className="size-4 cursor-pointer hover:opacity-80"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PreferenceAndProfileLink;
