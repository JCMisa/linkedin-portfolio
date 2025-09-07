"use client";

import { LinkPreview } from "@/components/ui/link-preview";
import { Separator } from "@/components/ui/separator";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PUBLIC_URL = "https://jcm-portfolio.vercel.app/";

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
    <div className="p-3 rounded-lg flex flex-col gap-4 bg-neutral-100 dark:bg-dark">
      <div className="flex flex-col items-start gap-2">
        <p className="text-lg font-bold">Languages</p>
        <div className="flex flex-col items-start gap-1 text-muted-foreground text-xs">
          <span>• English</span>
          <span>• Tagalog</span>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col items-start gap-2 w-full">
        <p className="text-lg font-bold">Public profile & URL</p>
        <div className="flex sm:items-center flex-col sm:flex-row items-start gap-2 sm:justify-between w-full">
          <LinkPreview
            url="https://jcm-portfolio.vercel.app/"
            className="text-xs text-muted-foreground hover:underline"
          >
            https://jcm-portfolio.vercel.app/
          </LinkPreview>

          {justCopied ? (
            <CopyCheckIcon className="size-4 text-green-600" />
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
