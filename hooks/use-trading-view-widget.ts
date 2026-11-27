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
  // Serialized config: a stable effect dependency and the script's payload
  const configJson = JSON.stringify(config);

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
    script.innerHTML = configJson;

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
  }, [scriptUrl, configJson, height]);

  return containerRef;
};

export default useTradingViewWidget;
