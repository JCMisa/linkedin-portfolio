import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ResumeEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentITResumeLink: string;
  currentVAResumeLink: string;
  onSave: (
    updatedITResumeLink: string,
    updatedVAResumeLink: string
  ) => Promise<void>;
}

const ResumeEditorDialog = ({
  open,
  onOpenChange,
  currentITResumeLink,
  currentVAResumeLink,
  onSave,
}: ResumeEditorDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [itResumeLink, setItResumeLink] = useState(currentITResumeLink);
  const [vaResumeLink, setVaResumeLink] = useState(currentVAResumeLink);

  useEffect(() => {
    if (open) {
      setItResumeLink(currentITResumeLink);
      setVaResumeLink(currentVAResumeLink);
    }
  }, [open, currentITResumeLink, currentVAResumeLink]);

  const isValidUrl = (url: string) => {
    try {
      // Try as is
      new URL(url);
      return true;
    } catch {
      try {
        // Try adding https:// if protocol is missing
        new URL(`https://${url}`);
        return true;
      } catch {
        return false;
      }
    }
  };

  const handleSave = async () => {
    if (!itResumeLink.trim() || !vaResumeLink.trim()) {
      toast.error(
        "Please fill in all required fields (IT Resume Link and VA Resume Link)"
      );
      return;
    }

    if (!isValidUrl(itResumeLink)) {
      toast.error("Please enter a valid URL for IT Resume Link");
      return;
    }

    if (!isValidUrl(vaResumeLink)) {
      toast.error("Please enter a valid URL for VA Resume Link");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(itResumeLink, vaResumeLink);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving resume:", error);
      toast.error("Failed to save resume. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Resumes</DialogTitle>
          <DialogDescription>
            Make changes to your resumes here. Click save to confirm your
            changes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-start gap-1">
            <Label htmlFor="itResume" className="text-xs">
              IT Resume Link
            </Label>
            <Input
              id="itResume"
              value={itResumeLink}
              onChange={(e) => setItResumeLink(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex flex-col items-start gap-1">
            <Label htmlFor="vaResume" className="text-xs">
              VA Resume Link
            </Label>
            <Input
              id="vaResume"
              value={vaResumeLink}
              onChange={(e) => setVaResumeLink(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isSaving} onClick={handleSave}>
            {isSaving ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeEditorDialog;
