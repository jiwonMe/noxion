"use client";

import { useEffect, useRef, useState } from "react";
import type { NotionBlockProps } from "../types";

export interface MermaidRendererProps extends NotionBlockProps {
  theme?: string;
  containerClass?: string;
}

export default function MermaidRenderer({
  block,
  blockId,
  level,
  children,
  theme = "default",
  containerClass,
}: MermaidRendererProps) {
  void blockId;
  void level;
  void children;

  const content = (block.properties as { title?: string[][] })?.title?.[0]?.[0] ?? "";
  const className = ["noxion-mermaid", containerClass].filter(Boolean).join(" ");
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!content || rendered) return;
    let cancelled = false;

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, theme });
        const { svg } = await mermaid.render(`mermaid-${blockId}`, content);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setRendered(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Invalid mermaid syntax");
        }
      }
    })();

    return () => { cancelled = true; };
  }, [content, theme, blockId, rendered]);

  if (error) {
    return (
      <div className={className} data-mermaid-theme={theme}>
        <div className="noxion-mermaid__error">{error}</div>
      </div>
    );
  }

  return (
    <div className={className} data-mermaid-theme={theme} ref={containerRef}>
      <pre data-mermaid>{content}</pre>
    </div>
  );
}
