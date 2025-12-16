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

interface NameEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onSave: (updatedName: string) => Promise<void>;
}

const NameEditorDialog = ({
  open,
  onOpenChange,
  currentName,
  onSave,
}: NameEditorDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (open) {
      setName(currentName);
    }
  }, [open, currentName]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please fill in all required fields (name)");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(name);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving name:", error);
      toast.error("Failed to save name. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Name</DialogTitle>
          <DialogDescription>
            Make changes to your name here. Click save to confirm your changes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start gap-1">
          <Label htmlFor="name" className="text-xs">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
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

export default NameEditorDialog;
