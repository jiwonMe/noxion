"use client";

import { useRef, useEffect, useCallback } from "react";
import type { SearchProps } from "../theme/types";

export function Search({
  onSearch,
  placeholder = "Search posts...",
  className,
}: SearchProps & { className?: string }) {
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
    <div className={className ? `noxion-search ${className}` : "noxion-search"}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        onChange={(e) => handleInput(e.target.value)}
        className="noxion-search__input"
      />
      <kbd className="noxion-search__kbd">⌘K</kbd>
    </div>
  );
}
