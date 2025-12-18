"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { updateAboutMessage } from "@/lib/actions/profileInfo";
import { showConfetti } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const EditAboutMessageDialog = ({ currentAbout }: { currentAbout: string }) => {
  const [open, setOpen] = useState(false);
  const [about, setAbout] = useState(currentAbout);
  const [isSaving, setIsSaving] = useState(false);

  // Reset local state when currentAbout changes or dialog opens
  useEffect(() => {
    if (open) {
      setAbout(currentAbout);
    }
  }, [open, currentAbout]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateAboutMessage(about);

      if (typeof result === "string") {
        throw new Error(result);
      }

      if (result && result.success) {
        toast.success("About message updated successfully");
        showConfetti();
        setOpen(false);
      } else {
        toast.error(result?.error || "Failed to update about message");
      }
    } catch (error) {
      console.error("Error updating about message:", error);
      toast.error("An error occurred while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = about !== currentAbout;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full sm:w-auto cursor-pointer"
          variant={"outline"}
          size={"sm"}
        >
          Edit About Message
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Edit About Message</DialogTitle>
          <DialogDescription>
            Update your professional summary. This will be displayed in the
            About section of your profile.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 px-6 py-4 overflow-y-auto no-scrollbar">
          <Textarea
            placeholder="Write something about yourself..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="min-h-[300px] h-full resize-none bg-neutral-50 dark:bg-neutral-900 border-none focus-visible:ring-1 focus-visible:ring-primary p-4"
          />
        </div>

        <DialogFooter className="p-6 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="min-w-[100px]"
          >
            {isSaving ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAboutMessageDialog;
