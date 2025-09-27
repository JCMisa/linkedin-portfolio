"use client";
import React, { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [widgetKey, setWidgetKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme change with loading state
  useEffect(() => {
    if (mounted) {
      setIsLoading(true);
      // Small delay to show loading state
      const timer = setTimeout(() => {
        setWidgetKey((prev) => prev + 1);
        setIsLoading(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [resolvedTheme, mounted]);

  if (!mounted) {
    return null;
  }

  const widgetTheme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10 rounded-[8px]">
          <div className="flex flex-col items-center gap-2">
            <div className="loader"></div>
            <span className="text-sm text-muted-foreground">
              Updating theme...
            </span>
          </div>
        </div>
      )}
      <TradingViewWidget
        key={widgetKey}
        scriptUrl={scriptUrl}
        config={{
          colorTheme: widgetTheme,
          ...config,
        }}
        className="custom-chart"
        height={600}
      />
    </div>
  );
}
