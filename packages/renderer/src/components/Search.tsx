"use client";

import { useRef, useEffect, useCallback } from "react";
import type { SearchProps } from "../theme/types";

export function Search({
  onSearch,
  placeholder = "Search posts...",
}: SearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInput = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onSearch(value), 200);
    },
    [onSearch]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="noxion-search" style={{ position: "relative", width: "100%" }}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        onChange={(e) => handleInput(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem 0.75rem",
          paddingRight: "3rem",
          borderRadius: "var(--noxion-border-radius, 0.5rem)",
          border: "1px solid var(--noxion-border, #e5e5e5)",
          backgroundColor: "var(--noxion-background, #fff)",
          color: "var(--noxion-foreground, #000)",
          fontSize: "0.875rem",
          outline: "none",
        }}
      />
      <kbd
        style={{
          position: "absolute",
          right: "0.5rem",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "0.75rem",
          padding: "0.125rem 0.375rem",
          borderRadius: "0.25rem",
          border: "1px solid var(--noxion-border, #e5e5e5)",
          color: "var(--noxion-mutedForeground, #737373)",
          pointerEvents: "none",
        }}
      >
        ⌘K
      </kbd>
    </div>
  );
}
