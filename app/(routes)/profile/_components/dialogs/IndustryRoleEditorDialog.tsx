import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

interface IndustryRoleEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIndustryRole: string;
  onSave: (updatedIndustryRole: string) => Promise<void>;
}

const IndustryRoleEditorDialog = ({
  open,
  onOpenChange,
  currentIndustryRole,
  onSave,
}: IndustryRoleEditorDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [industryRole, setIndustryRole] = useState(currentIndustryRole);

  useEffect(() => {
    if (open) {
      setIndustryRole(currentIndustryRole);
    }
  }, [open, currentIndustryRole]);

  const handleSave = async () => {
    if (!industryRole.trim()) {
      toast.error("Please fill in all required fields (name)");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(industryRole);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving industry role:", error);
      toast.error("Failed to save industry role. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Industry Role</DialogTitle>
          <DialogDescription>
            Make changes to your industry role here. Click save to confirm your
            changes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start gap-1">
          <Label htmlFor="industryRole" className="text-xs">
            Industry Role
          </Label>
          <Input
            id="industryRole"
            value={industryRole}
            onChange={(e) => setIndustryRole(e.target.value)}
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

export default IndustryRoleEditorDialog;
