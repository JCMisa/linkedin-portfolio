"use client";

import { useEffect, useState, useTransition } from "react";
import { useTheme } from "next-themes";
import TradingViewWidget from "./TradingViewWidget";

const SCRIPT_URL =
  "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";

const TOP_STORIES_CONFIG = {
  displayMode: "regular",
  feedMode: "market",
  blockColor: "change",
  isTransparent: false,
  locale: "en",
  market: "stock",
  width: "100%",
  height: "600",
};

const HEIGHT = 600;

/** TradingView "Top Stories" news timeline that follows the site theme. */
export function MarketNewsWidget() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [currentTheme, setCurrentTheme] = useState(resolvedTheme);

  // TODO(v3 phase 6): replace setState-in-effect with a mount-safe pattern
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

  // Reserve space before mount to prevent layout shift
  if (!mounted) return <div style={{ height: HEIGHT }} />;

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="loader"></div>
        </div>
      )}
      <TradingViewWidget
        key={currentTheme} // re-mount the embed when the theme changes
        scriptUrl={SCRIPT_URL}
        config={{
          ...TOP_STORIES_CONFIG,
          colorTheme: currentTheme === "dark" ? "dark" : "light",
        }}
        height={HEIGHT}
      />
    </div>
  );
}
