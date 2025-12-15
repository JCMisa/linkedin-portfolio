import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, SearchIcon } from "lucide-react";

const paths = [
  {
    value: "",
    label: "Home",
  },
  {
    value: "projects",
    label: "Projects",
  },
  {
    value: "experiences",
    label: "Experience",
  },
  {
    value: "certificates",
    label: "Certificates",
  },
  {
    value: "profile",
    label: "Profile",
  },
  {
    value: "contact",
    label: "Contact",
  },
];

const SearhPage = ({
  forMobile = false,
  additionalClassName,
  contentClassName,
}: {
  forMobile?: boolean;
  additionalClassName?: string;
  contentClassName?: string;
}) => {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const goToPath = (pathValue: string) => {
    // The path should be "/" for an empty value (Home) or "/path"
    const path = pathValue === "" ? "/" : `/${encodeURIComponent(pathValue)}`;
    router.push(path);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            `rounded-full w-[280px] h-[34px] border border-neutral-600 pl-[40px] pr-[16px] items-center justify-start`,
            forMobile ? "flex sm:hidden" : "hidden sm:flex",
            query ? "text-foreground" : "text-muted-foreground",
            additionalClassName
          )}
        >
          <SearchIcon className="opacity-50 " />
          {query
            ? paths.find((path) => path.value === query)?.label
            : "Search page..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[280px] p-0", contentClassName)}>
        <Command>
          <CommandInput placeholder="Search page..." className="h-9" />
          <CommandList>
            <CommandEmpty>No path found.</CommandEmpty>
            <CommandGroup>
              {paths.map((path) => (
                <CommandItem
                  key={path.value}
                  value={path.value}
                  onSelect={(currentValue) => {
                    setQuery(currentValue === query ? "" : currentValue);
                    setOpen(false);
                    goToPath(currentValue);
                  }}
                >
                  {path.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      query === path.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearhPage;
