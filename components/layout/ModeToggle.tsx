"use client";

import { MonitorIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AccentPicker } from "@/components/shared/AccentPicker";
import { useIsClient } from "@/hooks/use-is-client";
import { cn } from "@/lib/utils";

const THEMES = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: MonitorIcon },
] as const;

/** Navbar "Appearance" menu: light/dark/system + theme (accent) color. */
const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  // The stored theme is only known on the client; avoid a hydration mismatch
  const isClient = useIsClient();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Appearance settings">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 space-y-4 bg-card">
        <div className="space-y-2">
          <p className="text-sm font-semibold">Display</p>
          <div
            role="radiogroup"
            aria-label="Display mode"
            className="grid grid-cols-3 gap-1 rounded-full border p-1"
          >
            {THEMES.map(({ id, label, icon: Icon }) => {
              const selected = isClient && theme === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setTheme(id)}
                  className={cn(
                    "flex cursor-pointer items-center justify-center gap-1 rounded-full py-1 text-xs font-semibold transition-colors",
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">Theme color</p>
          <AccentPicker />
          <p className="text-xs text-muted-foreground">
            Applies in light and dark mode and is remembered on this device.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ModeToggle;
