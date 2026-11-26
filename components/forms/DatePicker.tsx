"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date | null | undefined;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  /** Show a clear button (e.g. "leave empty for Present"). */
  clearable?: boolean;
  id?: string;
  "aria-invalid"?: boolean;
}

/** Button + popover calendar with month/year dropdowns. */
export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  clearable = false,
  ...buttonProps
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            {...buttonProps}
            className={cn(
              "flex-1 justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="size-4" />
            {value ? format(value, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={value ?? undefined}
            defaultMonth={value ?? undefined}
            onSelect={(date) => {
              onChange(date ?? null);
              setOpen(false);
            }}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      {clearable && value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onChange(null)}
          aria-label="Clear date"
        >
          <XIcon className="size-4" />
        </Button>
      )}
    </div>
  );
}
