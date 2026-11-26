"use client";

import { Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { paths } from "./search-paths";

/** The cmdk list inside the search popover (loaded when first opened). */
export default function SearchCommandList({
  query,
  onSelect,
}: {
  query: string;
  onSelect: (value: string) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Search page..." className="h-9" />
      <CommandList>
        <CommandEmpty>No path found.</CommandEmpty>
        <CommandGroup>
          {paths.map((path) => (
            <CommandItem
              key={path.value}
              value={path.value}
              onSelect={onSelect}
            >
              {path.label}
              <Check
                className={cn(
                  "ml-auto",
                  query === path.value ? "opacity-100" : "opacity-0",
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
