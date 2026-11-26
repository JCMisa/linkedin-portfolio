"use client";

import { useEffect, useRef } from "react";

const useTradingViewWidget = (
  scriptUrl: string,
  config: Record<string, unknown>,
  height = 600,
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Track if we are currently cleaning up to prevent race conditions
  const isDestroying = useRef(false);

  useEffect(() => {
    const current = containerRef.current;
    if (!current) return;

    isDestroying.current = false;

    // 1. Clear previous widget content safely
    while (current.firstChild) {
      current.removeChild(current.firstChild);
    }

    // 2. Create the widget container div
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    widgetContainer.style.width = "100%";
    widgetContainer.style.height = `${height}px`;
    current.appendChild(widgetContainer);

    // 3. Prepare the script
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify(config);

    // 4. Use requestAnimationFrame instead of setTimeout(0)
    // This ensures the browser has painted the container before the script runs
    const frameId = requestAnimationFrame(() => {
      if (!isDestroying.current && current) {
        current.appendChild(script);
      }
    });

    return () => {
      isDestroying.current = true;
      cancelAnimationFrame(frameId);
      if (current) {
        current.innerHTML = "";
      }
    };
    // Use a stable key for the config to avoid unnecessary re-runs
  }, [scriptUrl, JSON.stringify(config), height]);

  return containerRef;
};

export default useTradingViewWidget;
