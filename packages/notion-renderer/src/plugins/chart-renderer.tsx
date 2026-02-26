"use client";

import { useEffect, useRef, useState } from "react";
import type { NotionBlockProps } from "../types";

export interface ChartConfig {
  type: "bar" | "line" | "pie";
  data: Record<string, unknown>;
  options?: Record<string, unknown>;
}

export default function ChartRenderer({
  block,
  blockId,
  level,
  children,
  containerClass,
}: NotionBlockProps & { containerClass?: string }) {
  void blockId;
  void level;
  void children;

  const content = (block.properties as { title?: string[][] })?.title?.[0]?.[0] ?? "";
  const className = ["noxion-chart", containerClass].filter(Boolean).join(" ");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  let config: ChartConfig | null = null;
  let parseError = false;
  try {
    config = JSON.parse(content) as ChartConfig;
  } catch {
    parseError = true;
  }

  useEffect(() => {
    if (parseError || !config || !canvasRef.current) return;
    let chartInstance: { destroy: () => void } | null = null;

    (async () => {
      try {
        const { Chart, registerables } = await import("chart.js");
        Chart.register(...registerables);
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;
        chartInstance = new Chart(ctx, {
          type: config!.type,
          data: config!.data as never,
          options: config!.options as never,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to render chart");
      }
    })();

    return () => {
      chartInstance?.destroy();
    };
  }, [content, parseError]);

  if (parseError || !config) {
    return (
      <div className={className}>
        <div className="noxion-chart__error">Invalid chart configuration</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="noxion-chart__error">{error}</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <canvas ref={canvasRef} data-chart-config={JSON.stringify(config)} />
    </div>
  );
}
