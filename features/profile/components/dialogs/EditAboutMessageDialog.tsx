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
import { updateAboutMessage } from "@/features/profile/actions";
import { showConfetti } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getActionError } from "@/lib/action-result";

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
      const result = await updateAboutMessage({ about });
      const error = getActionError(result);

      if (!error) {
        toast.success("About message updated successfully");
        showConfetti();
        setOpen(false);
      } else {
        toast.error(error ?? "Failed to update about message");
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
          className="w-full cursor-pointer sm:w-auto"
          variant={"outline"}
          size={"sm"}
        >
          Edit About Message
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Edit About Message</DialogTitle>
          <DialogDescription>
            Update your professional summary. This will be displayed in the
            About section of your profile.
          </DialogDescription>
        </DialogHeader>

        <div className="no-scrollbar flex-1 overflow-y-auto px-6 py-4">
          <Textarea
            placeholder="Write something about yourself..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="h-full min-h-[300px] resize-none border-none bg-neutral-50 p-4 focus-visible:ring-1 focus-visible:ring-primary dark:bg-neutral-900"
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
