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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateServices } from "@/lib/actions/profileInfo";
import {
  Loader2Icon,
  PlusIcon,
  XIcon,
  BriefcaseIcon,
  PenBoxIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { showConfetti } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ServicesEditorDialogProps {
  currentServices: string[];
}

const ServicesEditorDialog = ({
  currentServices,
}: ServicesEditorDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [services, setServices] = useState<string[]>(currentServices);
  const [newService, setNewService] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isDialogOpen) {
      setServices(currentServices);
    }
  }, [isDialogOpen, currentServices]);

  const handleAddService = () => {
    if (!newService.trim()) return;
    if (services.includes(newService.trim())) {
      toast.error("Service already added");
      return;
    }
    setServices([...services, newService.trim()]);
    setNewService("");
  };

  const handleRemoveService = (service: string) => {
    setServices(services.filter((s) => s !== service));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateServices(services);

      if (typeof result === "string") {
        throw new Error(result);
      }

      if (result && result.success) {
        toast.success("Services updated successfully");
        showConfetti();
        setIsDialogOpen(false);
      } else {
        toast.error(result?.error || "Failed to update services");
      }
    } catch (error) {
      console.error("Error updating services:", error);
      toast.error("An error occurred while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    JSON.stringify(services) !== JSON.stringify(currentServices);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div
          onClick={() => setIsDialogOpen(true)}
          className="flex-none flex items-center justify-center rounded-full w-7 h-7 cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out shadow-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black "
        >
          <PenBoxIcon className="size-4 " />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BriefcaseIcon className="size-5 text-primary" />
            Edit Services
          </DialogTitle>
          <DialogDescription>
            Manage the list of services you offer to your clients.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="service"
              className="text-xs font-bold text-neutral-500 uppercase tracking-wider"
            >
              Add New Service
            </Label>
            <div className="flex gap-2">
              <Input
                id="service"
                placeholder="e.g. Web Development"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddService();
                  }
                }}
              />
              <Button
                type="button"
                size="icon"
                onClick={handleAddService}
                className="shrink-0 bg-primary hover:bg-primary-600"
              >
                <PlusIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Current Services ({services.length})
            </Label>
            <ScrollArea className="h-[200px] w-full rounded-md border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-900/50">
              <div className="flex flex-wrap gap-2">
                {services.length > 0 ? (
                  services.map((service) => (
                    <Badge
                      key={service}
                      variant="secondary"
                      className="pl-3 pr-1 py-1 gap-1 bg-white dark:bg-dark border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 transition-all hover:bg-primary/5 hover:border-primary/20"
                    >
                      {service}
                      <button
                        onClick={() => handleRemoveService(service)}
                        className="p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500 italic p-4 text-center w-full">
                    No services added yet.
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="min-w-[100px] bg-primary hover:bg-primary-600"
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

export default ServicesEditorDialog;
