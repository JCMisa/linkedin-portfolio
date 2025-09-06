import { LinkPreview } from "@/components/ui/link-preview";
import { Separator } from "@/components/ui/separator";

const PreferenceAndProfileLink = () => {
  return (
    <div className="p-3 rounded-lg flex flex-col gap-4 bg-neutral-200 dark:bg-dark">
      <div className="flex flex-col items-start gap-2">
        <p className="text-lg font-bold">Languages</p>
        <div className="flex flex-col items-start gap-1 text-muted-foreground text-xs">
          <span>• English</span>
          <span>• Tagalog</span>
        </div>
      </div>

      <Separator />

      {/* // todo: change the url once deployed  */}
      <div className="flex flex-col items-start gap-2">
        <p className="text-lg font-bold">Public profile & URL</p>
        <LinkPreview
          url="https://github.com/JCMisa"
          className="text-xs text-muted-foreground hover:underline"
        >
          https://github.com/JCMisa
        </LinkPreview>
      </div>
    </div>
  );
};

export default PreferenceAndProfileLink;
