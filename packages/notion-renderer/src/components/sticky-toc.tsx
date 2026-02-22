"use client";

import { useEffect, useState, useCallback } from "react";
import type { Decoration } from "notion-types";
import { useNotionRenderer } from "../context";

const HEADING_TYPES = new Set(["header", "sub_header", "sub_sub_header"]);

interface Heading {
  id: string;
  text: string;
  level: number;
}

function useHeadings(): Heading[] {
  const { recordMap } = useNotionRenderer();
  const headings: Heading[] = [];

  for (const [id, blockRecord] of Object.entries(recordMap.block)) {
    const val = blockRecord?.value;
    const resolved = (val && typeof val === "object" && "role" in val && "value" in val)
      ? (val as { value: { type?: string; properties?: { title?: Decoration[] }; alive?: boolean } }).value
      : val as { type?: string; properties?: { title?: Decoration[] }; alive?: boolean } | undefined;

    if (!resolved?.alive) continue;
    if (!resolved.type || !HEADING_TYPES.has(resolved.type)) continue;

    const text = resolved.properties?.title?.map((s: Decoration) => s[0]).join("") ?? "";
    if (!text) continue;

    const level = resolved.type === "header" ? 1 : resolved.type === "sub_header" ? 2 : 3;
    headings.push({ id, text, level });
  }

  return headings;
}

function useActiveHeading(headingIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleScroll = useCallback(() => {
    if (!headingIds.length) return;

    let current: string | null = null;
    const threshold = window.innerHeight * 0.4;

    for (const id of headingIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= threshold) {
        current = id;
      }
    }

    setActiveId(current);
  }, [headingIds]);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return activeId;
}

export function StickyTOC() {
  const headings = useHeadings();
  const activeId = useActiveHeading(headings.map((h) => h.id));

  if (!headings.length) return null;

  return (
    <div className="noxion-sticky-toc" aria-hidden="true">
      <nav className="noxion-sticky-toc__inner">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={
              `noxion-sticky-toc__item noxion-sticky-toc__item--level-${heading.level}` +
              (activeId === heading.id ? " noxion-sticky-toc__item--active" : "")
            }
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
