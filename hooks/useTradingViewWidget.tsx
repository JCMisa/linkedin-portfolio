"use client";
import { useEffect, useRef } from "react";

const useTradingViewWidget = (
  scriptUrl: string,
  config: Record<string, unknown>,
  height = 600
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const current = containerRef.current;

    if (!current) return;

    // Clear previous widget
    current.innerHTML = `<div class="tradingview-widget-container__widget" style="width: 100%; height: ${height}px;"></div>`;

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.innerHTML = JSON.stringify(config);

    current.appendChild(script);
    current.dataset.loaded = "true";

    return () => {
      if (current) {
        current.innerHTML = "";
        delete current.dataset.loaded;
      }
    };
  }, [scriptUrl, JSON.stringify(config), height]); // Stringify config for proper comparison

  return containerRef;
};

export default useTradingViewWidget;
