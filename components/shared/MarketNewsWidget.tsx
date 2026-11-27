"use client";

import { useTheme } from "next-themes";
import { useInView } from "@/hooks/use-in-view";
import { useIsClient } from "@/hooks/use-is-client";
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

/**
 * TradingView "Top Stories" news timeline that follows the site theme.
 * The third-party embed (script + iframe) only loads once the widget is
 * near the viewport.
 */
export function MarketNewsWidget() {
  const { resolvedTheme } = useTheme();
  const isClient = useIsClient();
  const [ref, inView] = useInView<HTMLDivElement>();

  // Same-size placeholder until we can render (prevents layout shift)
  const ready = isClient && inView && resolvedTheme;

  return (
    <div ref={ref} style={{ minHeight: HEIGHT }}>
      {ready && (
        <TradingViewWidget
          key={resolvedTheme} // re-mount the embed when the theme changes
          scriptUrl={SCRIPT_URL}
          config={{
            ...TOP_STORIES_CONFIG,
            colorTheme: resolvedTheme === "dark" ? "dark" : "light",
          }}
          height={HEIGHT}
        />
      )}
    </div>
  );
}
