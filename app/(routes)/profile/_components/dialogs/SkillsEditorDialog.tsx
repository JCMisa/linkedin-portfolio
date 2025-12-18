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
import { updateSkills } from "@/lib/actions/profileInfo";
import {
  Loader2Icon,
  PlusIcon,
  XIcon,
  WrenchIcon,
  PenBoxIcon,
  Trash2Icon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { showConfetti } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type SkillCategory = {
  id: string;
  title: string;
  description: string;
  items: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
};

interface SkillsEditorDialogProps {
  currentSkills: SkillCategory[];
}

const SkillsEditorDialog = ({ currentSkills }: SkillsEditorDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [skillCategories, setSkillCategories] =
    useState<SkillCategory[]>(currentSkills);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isDialogOpen) {
      setSkillCategories(currentSkills.length > 0 ? currentSkills : []);
    }
  }, [isDialogOpen, currentSkills]);

  const handleAddCategory = () => {
    const newCategory: SkillCategory = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSkillCategories([...skillCategories, newCategory]);
  };

  const handleRemoveCategory = (id: string) => {
    setSkillCategories(skillCategories.filter((cat) => cat.id !== id));
  };

  const handleUpdateCategory = (
    id: string,
    field: keyof SkillCategory,
    value: any
  ) => {
    setSkillCategories(
      skillCategories.map((cat) =>
        cat.id === id
          ? { ...cat, [field]: value, updatedAt: new Date().toISOString() }
          : cat
      )
    );
  };

  const handleAddItem = (categoryId: string, item: string) => {
    if (!item.trim()) return;
    setSkillCategories(
      skillCategories.map((cat) => {
        if (cat.id === categoryId) {
          if (cat.items.includes(item.trim())) {
            toast.error("Skill already added to this category");
            return cat;
          }
          return {
            ...cat,
            items: [...cat.items, item.trim()],
            updatedAt: new Date().toISOString(),
          };
        }
        return cat;
      })
    );
  };

  const handleRemoveItem = (categoryId: string, itemToRemove: string) => {
    setSkillCategories(
      skillCategories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.filter((item) => item !== itemToRemove),
              updatedAt: new Date().toISOString(),
            }
          : cat
      )
    );
  };

  const handleSave = async () => {
    // Basic validation
    if (skillCategories.some((cat) => !cat.title.trim())) {
      toast.error("Please provide a title for every skill category.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateSkills(skillCategories);

      if (typeof result === "string") {
        throw new Error(result);
      }

      if (result && result.success) {
        toast.success("Skills updated successfully");
        showConfetti();
        setIsDialogOpen(false);
      } else {
        toast.error(result?.error || "Failed to update skills");
      }
    } catch (error) {
      console.error("Error updating skills:", error);
      toast.error("An error occurred while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    JSON.stringify(skillCategories) !== JSON.stringify(currentSkills);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div
          onClick={() => setIsDialogOpen(true)}
          className="flex-none flex items-center justify-center rounded-full w-7 h-7 cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out shadow-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black"
        >
          <PenBoxIcon className="size-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <WrenchIcon className="size-5 text-primary" />
            Edit Skills & Expertise
          </DialogTitle>
          <DialogDescription>
            Group your skills into categories to make them easier to browse.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4 overflow-y-auto no-scrollbar">
          <div className="space-y-6 pb-6">
            {skillCategories.map((category, index) => (
              <div
                key={category.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 space-y-4 relative group/card"
              >
                <button
                  onClick={() => handleRemoveCategory(category.id)}
                  className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                >
                  <Trash2Icon className="size-4" />
                </button>

                <div className="space-y-4 pr-10">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                      Category Title
                    </Label>
                    <Input
                      placeholder="e.g. Programming Languages"
                      value={category.title}
                      onChange={(e) =>
                        handleUpdateCategory(
                          category.id,
                          "title",
                          e.target.value
                        )
                      }
                      className="h-9 font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                      Skills
                    </Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {category.items.map((item) => (
                        <Badge
                          key={`${category.id}-${item}`}
                          variant="secondary"
                          className="pl-3 pr-1 py-1 gap-1 bg-white dark:bg-dark border-neutral-200 dark:border-neutral-800"
                        >
                          {item}
                          <button
                            onClick={() => handleRemoveItem(category.id, item)}
                            className="p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors"
                          >
                            <XIcon className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill..."
                        className="h-8 text-xs"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddItem(category.id, e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2"
                        onClick={(e) => {
                          const input = e.currentTarget
                            .previousElementSibling as HTMLInputElement;
                          handleAddItem(category.id, input.value);
                          input.value = "";
                        }}
                      >
                        <PlusIcon className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full h-12 border-dashed border-2 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
              onClick={handleAddCategory}
            >
              <PlusIcon className="size-4" />
              Add New Category
            </Button>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 border-t">
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
            className="min-w-[120px] bg-primary hover:bg-primary-600"
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

export default SkillsEditorDialog;
