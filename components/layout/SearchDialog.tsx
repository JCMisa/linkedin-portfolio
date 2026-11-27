import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { paths } from "./search-paths";

// cmdk is only needed once the popover opens
const SearchCommandList = dynamic(() => import("./SearchCommandList"));

const SearchDialog = ({
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
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className={cn(
            `h-[34px] w-[180px] items-center justify-start rounded-full border border-input pr-[16px] pl-[40px] lg:w-[280px]`,
            forMobile ? "flex sm:hidden" : "hidden sm:flex",
            query ? "text-foreground" : "text-muted-foreground",
            additionalClassName,
          )}
        >
          <SearchIcon className="opacity-50" />
          {query
            ? paths.find((path) => path.value === query)?.label
            : "Search pages…"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[280px] p-0", contentClassName)}>
        {open && (
          <SearchCommandList
            query={query}
            onSelect={(currentValue) => {
              setQuery(currentValue === query ? "" : currentValue);
              setOpen(false);
              goToPath(currentValue);
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default SearchDialog;
