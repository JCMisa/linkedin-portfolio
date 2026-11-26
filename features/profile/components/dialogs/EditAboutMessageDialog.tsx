"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getActionError } from "@/lib/action-result";
import { showConfetti } from "@/lib/confetti";
import { toast } from "sonner";
import { updateAboutMessage } from "../../actions";
import { TextFieldEditorDialog } from "./TextFieldEditorDialog";

/** "Edit About Message" button + dialog (owner only). */
const EditAboutMessageDialog = ({ currentAbout }: { currentAbout: string }) => {
  const [open, setOpen] = useState(false);

  const save = async (about: string) => {
    const error = getActionError(await updateAboutMessage({ about }));
    if (error) throw new Error(error);
    toast.success("About message updated");
    showConfetti();
  };

  return (
    <>
      <Button
        className="w-full cursor-pointer sm:w-auto"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Edit About Message
      </Button>
      <TextFieldEditorDialog
        open={open}
        onOpenChange={setOpen}
        title="Edit about message"
        description="Your professional summary, shown in the About section."
        label="About"
        value={currentAbout}
        maxLength={5000}
        multiline
        onSave={save}
      />
    </>
  );
};

export default EditAboutMessageDialog;
