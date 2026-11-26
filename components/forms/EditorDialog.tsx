"use client";

import type { ReactNode } from "react";
import { Loader2Icon } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface EditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  /** Optional element that opens the dialog (omit for externally controlled dialogs). */
  trigger?: ReactNode;
  /** Form submit handler, usually `form.handleSubmit(onValid)`. */
  onSubmit: (e?: React.BaseSyntheticEvent) => void | Promise<void>;
  isSubmitting?: boolean;
  /** Disable submit, e.g. while an image is uploading. */
  submitDisabled?: boolean;
  submitLabel?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Shared shell for every create/edit dialog: header, scrollable form body and
 * a Cancel / Save footer with a pending state. Render it inside shadcn <Form>.
 */
export function EditorDialog({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  onSubmit,
  isSubmitting = false,
  submitDisabled = false,
  submitLabel = "Save changes",
  className,
  children,
}: EditorDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !isSubmitting && onOpenChange(next)}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "no-scrollbar max-h-[90vh] overflow-y-auto sm:max-w-lg",
          className,
        )}
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          <div className="flex flex-col gap-4">{children}</div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || submitDisabled}>
              {isSubmitting && <Loader2Icon className="size-4 animate-spin" />}
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
