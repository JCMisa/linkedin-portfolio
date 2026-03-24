"use client";
import { useEffect, useState, useTransition } from "react"; // Use useTransition for smoother theme shifts
import { useTheme } from "next-themes";
import TradingViewWidget from "@/components/custom/TradingViewWidget";

interface ThemedTradingViewWidgetProps {
  scriptUrl: string;
  config: Record<string, unknown>;
}

export function ThemedTradingViewWidget({
  scriptUrl,
  config,
}: ThemedTradingViewWidgetProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition(); // Better than setTimeout for hydration
  const [currentTheme, setCurrentTheme] = useState(resolvedTheme);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && resolvedTheme !== currentTheme) {
      startTransition(() => {
        setCurrentTheme(resolvedTheme);
      });
    }
  }, [resolvedTheme, mounted, currentTheme]);

  if (!mounted) return <div style={{ height: 600 }} />; // Maintain aspect ratio to prevent layout shift

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <div className="loader"></div>
        </div>
      )}
      <TradingViewWidget
        key={currentTheme} // Using theme as key is cleaner than a numeric counter
        scriptUrl={scriptUrl}
        config={{
          ...config,
          colorTheme: currentTheme === "dark" ? "dark" : "light",
        }}
        height={600}
      />
    </div>
  );
}
